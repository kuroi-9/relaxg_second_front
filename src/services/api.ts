import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
    AxiosError,
} from "axios";
import authService from "./authService";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add the request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = authService.getAccessToken();
        if (accessToken) {
            // TypeScript might complain that headers are potentially undefined, so check
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

// Flag to avoid multiple refresh loops
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
    error: AxiosError | null,
    token: string | null = null,
) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Add the response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        }; // Added type for _retry

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                // If a refresh is already in progress, queue the request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers["Authorization"] =
                            `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await authService.refreshToken();
                if (newAccessToken) {
                    apiClient.defaults.headers.common["Authorization"] =
                        `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    // New access token received, retry the original request
                    return apiClient(originalRequest);
                } else {
                    // If newAccessToken is null (invalid refresh token), log out
                    authService.logout();
                    processQueue(error); // Reject all pending requests
                    // window.location.href = '/login'; // Client-side redirection if necessary
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                authService.logout();
                processQueue(refreshError as AxiosError); // Reject all pending requests
                // window.location.href = '/login'; // Client-side redirection if necessary
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // If the 401 is not for a refresh or is already a retry
        // Or if it's another HTTP error
        return Promise.reject(error);
    },
);

export default apiClient;
