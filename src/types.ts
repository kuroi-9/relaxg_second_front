export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    username: string;
    // Ajoutez d'autres propriétés de l'utilisateur si elles sont décodées du token ou récupérées
    // ex: id: number;
    // ex: email: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    // Ajoutez getAccessToken si vous voulez l'exposer via le contexte (pour les intercepteurs)
}
