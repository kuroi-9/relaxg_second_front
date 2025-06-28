import { createContext } from "react";
import type { AuthContextType } from "../types";

// Create the context with a default type or null (and handle null)
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);
