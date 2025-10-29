import { useContext } from "react";
import LibraryContext from "../contexts/LibraryContextDefinition";
import type { LibraryContextType } from "../types";

export const useLibrary = (): LibraryContextType => {
    const context = useContext(LibraryContext);
    if (!context) {
        throw new Error("useLibrary must be used within an LibraryProvider");
    }
    return context;
};
