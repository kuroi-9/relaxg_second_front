import React, { useState, useEffect, useMemo } from "react";
import JobsManagerService from "../services/jobsManagerService";
import type { Job } from "../types";
import JobsManagerContext from "./JobsManagerContextDefinition";

const JobsManagerContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const fetchedJobs = await JobsManagerService.getJobs();
                setJobs(fetchedJobs ?? []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const contextValue = useMemo(
        () => ({
            jobs,
            loading,
        }),
        [jobs, loading],
    );

    return (
        <JobsManagerContext.Provider value={contextValue}>
            {children}
        </JobsManagerContext.Provider>
    );
};

export default JobsManagerContextProvider;
