import { useContext } from "react";
import LibraryContext from "../contexts/LibraryContextDefinition";
import type { LibraryContextType } from "../types";

/**
 * Custom hook that returns the current library context.
 */
export const useLibrary = (): LibraryContextType => {
    const context = useContext(LibraryContext);
    if (!context) {
        throw new Error("useLibrary must be used within an LibraryProvider");
    }
    return context;
};
