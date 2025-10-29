import { createContext } from "react";
import type { LibraryContextType } from "../types";

const LibraryContext = createContext<LibraryContextType | null>(null);
export default LibraryContext;
