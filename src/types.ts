/**
 * Interface for user information.
 * Adapt this according to the data that your Django backend returns.
 */
export interface User {
    id: number;
    username: string;
    email: string;
    // Add other fields if your API returns them (e.g., firstName, lastName)
}

/**
 * Interface for the authentication context.
 * Defines what is exposed by `useAuth`.
 */
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}
