import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import type { ExtendedAxiosRequestConfig } from "../interfaces";

const API_BASE_URL: string =
    import.meta.env.VITE_API_URL_DEV_OVER_NETWORK ||
    import.meta.env.VITE_API_URL;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing: boolean = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
    originalRequest: InternalAxiosRequestConfig;
}> = [];

const processFailedQueue = (
    error: AxiosError | null,
    token: string | null = null,
): void => {
    failedQueue.forEach((promiseActionsSet) => {
        if (error) {
            promiseActionsSet.reject(error);
        } else {
            promiseActionsSet.resolve(token);
        }
    });
    failedQueue = [];
};

// CSRF request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const methodsWithoutCsrf = ["GET", "HEAD", "OPTIONS"];

        // Sending CSRF token for POST, PUT, PATCH, DELETE
        if (!methodsWithoutCsrf.includes(config.method!.toUpperCase())) {
            const csrftoken = Cookies.get("csrftoken"); // Getting CSRF token from cookie
            if (csrftoken) {
                config.headers["X-CSRFToken"] = csrftoken; // Adding token to header
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Error handling interceptor, when 401 (Unauthorized) for example
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest: InternalAxiosRequestConfig = error.config!; // AxiosError always has a config property
        const responseStatus = error.response?.status;

        // If the error is 401 (Unauthorized) and this is not already a refresh attempt
        // and the URL is not the refresh endpoint (to avoid loops)
        if (
            responseStatus === 401 &&
            !(originalRequest as ExtendedAxiosRequestConfig)._retry &&
            !originalRequest.url?.includes("/token/refresh/")
        ) {
            (originalRequest as ExtendedAxiosRequestConfig)._retry = true; // Mark the request as retried

            if (isRefreshing) {
                // If a refresh is already in progress, put this request on hold
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, originalRequest });
                })
                    .then(() => {
                        return axiosInstance(originalRequest); // Replay the original request with the new token
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;

            try {
                // Try to refresh the token
                await axiosInstance.post("/token/refresh/", {});
                // The new tokens are automatically updated in the cookies by the backend.

                isRefreshing = false;
                processFailedQueue(null); // Process all pending requests
                return axiosInstance(originalRequest); // Replay the original request with the new token
            } catch (refreshError: unknown) {
                isRefreshing = false;
                processFailedQueue(refreshError as AxiosError | null); // Inform all pending requests of the error
                console.error(
                    "Impossible to refresh token, logging out...",
                    refreshError,
                );

                // Important: Trigger logout via the Auth context here.
                // We'll handle this in the `AuthContext` by injecting the logout function.
                throw refreshError as AxiosError; // Rejeter l'erreur pour que le flux normal du catch soit appelé
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
