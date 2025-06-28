export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    username: string;
    // To be completed
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    // Add getAccessToken to expose it via the context (for interceptors)
}
