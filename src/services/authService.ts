import axios from "axios";
import { type AuthTokens } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const login = async (
    username: string,
    password: string,
): Promise<AuthTokens> => {
    try {
        const response = await axios.post<AuthTokens>(`${API_URL}/token/`, {
            username,
            password,
        });
        if (response.data.access) {
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
        }
        return response.data;
    } catch (error) {
        // Use 'any' for a generic error type or refine with AxiosError
        console.error("Login failed:", error);
        throw error;
    }
};

const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
};

const getRefreshToken = (): string | null => {
    return localStorage.getItem("refresh_token");
};

const refreshToken = async (): Promise<string | null> => {
    const refresh = getRefreshToken();
    if (!refresh) {
        logout();
        throw new Error("No refresh token available. User must log in again.");
    }
    try {
        const response = await axios.post<AuthTokens>(
            `${API_URL}/token/refresh/`,
            {
                refresh,
            },
        );
        if (response.data.access) {
            localStorage.setItem("access_token", response.data.access);
            return response.data.access;
        }
        return null;
    } catch (error) {
        // Handle refresh token errors
        console.error("Failed to refresh the token:", error);
        logout(); // If the refresh token is invalid, log out
        throw error;
    }
};

export default {
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    refreshToken,
};
