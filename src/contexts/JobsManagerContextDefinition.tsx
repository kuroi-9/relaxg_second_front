import { createContext } from "react";
import type { JobsManagerContextType } from "../types";

const JobsManagerContext = createContext<JobsManagerContextType | null>(null);
export default JobsManagerContext;
