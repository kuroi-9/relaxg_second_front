import React, { useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import type { AuthContextType, User } from "../types";
import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        const accessToken = authService.getAccessToken();
        const refreshToken = authService.getRefreshToken();

        if (accessToken) {
            // In a real application, you would decode the JWT here to extract user information
            // For this ultra-minimal example, we simulate a user
            setIsAuthenticated(true);
            setUser({ username: "MinimalUser" });
        } else if (refreshToken) {
            try {
                const newAccessToken = await authService.refreshToken();
                if (newAccessToken) {
                    setIsAuthenticated(true);
                    setUser({ username: "MinimalUser" });
                } else {
                    handleLogout(); // If the refresh fails, log out
                }
            } catch (error) {
                console.error("Error during token refresh:", error);
                handleLogout(); // If the refresh fails, log out
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const handleLogin = async (
        username: string,
        password: string,
    ): Promise<boolean> => {
        try {
            await authService.login(username, password);
            await initializeAuth(); // Re-initialize the state after a successful login
            return true;
        } catch (error) {
            console.error("Error in handleLogin:", error);
            throw error;
        }
    };

    const handleLogout = (): void => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    const authContextValue: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
