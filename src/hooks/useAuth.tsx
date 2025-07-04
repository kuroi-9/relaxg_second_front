import { useContext } from "react";
import { type AuthContextType } from "../types"; // Importe tes types
import AuthContext from "../contexts/AuthContextDefinition";

// Custom hook to consume the context with precise typing
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
