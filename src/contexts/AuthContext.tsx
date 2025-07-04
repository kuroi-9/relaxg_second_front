import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import AuthService from "../services/authService";
import axiosInstance from "../api/axios";
import { type User, type AuthContextType } from "../types"; // Importe tes types
import type { AxiosError } from "axios";
import AuthContext from "./AuthContextDefinition";
import type { ExtendedAxiosRequestConfig } from "../interfaces";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const logoutRef = useRef<(() => Promise<void>) | null>(null);

    const handleLogin = useCallback(
        async (username: string, password: string): Promise<boolean> => {
            try {
                const userData = await AuthService.login(username, password);
                setUser(userData);
                return true;
            } catch (error: unknown) {
                setUser(null);
                throw error;
            }
        },
        [],
    );

    const handleLogout = useCallback(async (): Promise<void> => {
        try {
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
            setUser(null);
        }
    }, []);

    // Update logoutRef when handleLogout changes (which is rare thanks to useCallback)
    useEffect(() => {
        logoutRef.current = handleLogout;
    }, [handleLogout]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const userData = await AuthService.getUserInfo();
                setUser(userData);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();

        // Add the second response interceptor after initial status check
        // to ensure `handleLogout` is defined.
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (
                    error.response?.status === 401 &&
                    (error.config as ExtendedAxiosRequestConfig)?._retry &&
                    !error.config?.url?.includes("/token/refresh/")
                ) {
                    console.warn(
                        "Auth failed after refresh attempt (or no refresh token available), logging out...",
                    );
                    if (logoutRef.current) {
                        logoutRef.current(); // Logout using the ref of the logout function
                    } else {
                        console.error(
                            "Logout function not available in interceptor.",
                        );
                        // Fallback if the logout function is not available
                        setUser(null);
                        window.location.href = "/login";
                    }
                }
                return Promise.reject(error);
            },
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, []);

    const isAuthenticated = useMemo(() => !!user, [user]);

    const contextValue = useMemo<AuthContextType>(
        () => ({
            user,
            loading,
            isAuthenticated,
            login: handleLogin,
            logout: handleLogout,
        }),
        [user, loading, isAuthenticated, handleLogin, handleLogout],
    );

    if (loading) {
        return <div>Chargement de l'authentification...</div>; // TODO: Add a spinner or a loading message
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
