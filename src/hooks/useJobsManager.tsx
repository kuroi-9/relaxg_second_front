import { useContext } from "react";
import JobsManagerContext from "../contexts/JobsManagerContextDefinition";
import type { JobsManagerContextType } from "../types";

/**
 * Custom hook for accessing the JobsManagerContext.
 * @returns {JobsManagerContextType} The JobsManagerContext.
 */
export const useJobsManager = (): JobsManagerContextType => {
    const context = useContext(JobsManagerContext);
    if (!context) {
        throw new Error(
            "useJobsManager must be used within a JobsManagerProvider",
        );
    }
    return context;
};
