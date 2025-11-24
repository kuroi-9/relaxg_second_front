import React, { useState, useEffect, useMemo, useCallback } from "react";
import JobsManagerService from "../services/jobsManagerService";
import type { Job, JobStatus } from "../types";
import JobsManagerContext from "./JobsManagerContextDefinition";

const JobsManagerContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobsProgress = useMemo(
        () => async () => {
            try {
                return await JobsManagerService.getJobsProgress();
            } catch (error) {
                console.error("Error starting job:", error);
                return false;
            }
        },
        [],
    );

    const fetchJobStatus = useMemo(
        () =>
            async (jobId: number): Promise<JobStatus | null> => {
                try {
                    return await JobsManagerService.getJobStatus(jobId);
                } catch (error) {
                    console.error("Error fetching job status:", error);
                    return null;
                }
            },
        [],
    );

    const startJob = useMemo(
        () =>
            async (jobId: number): Promise<Job | null> => {
                try {
                    const updatedJob = await JobsManagerService.startJob(jobId);
                    if (updatedJob) {
                        setJobs((prevJobs) =>
                            prevJobs.map((job) =>
                                job.id === jobId ? updatedJob : job,
                            ),
                        );
                    }
                    return updatedJob;
                } catch (error) {
                    console.error("Error starting job:", error);
                    return null;
                }
            },
        [],
    );

    const stopJob = useCallback(async (jobId: number): Promise<boolean> => {
        try {
            const isStopped = await JobsManagerService.stopJob(jobId);
            if (isStopped) {
                console.log("Job stopped successfully");
            }
            return isStopped;
        } catch (error) {
            console.error("Error stopping job:", error);
            return false;
        }
    }, []);

    const deleteJob = useCallback(async (jobId: number) => {
        try {
            const isDeleted = await JobsManagerService.deleteJob(jobId);
            if (isDeleted) {
                setJobs((prevJobs) =>
                    prevJobs.filter((job) => job.id !== jobId),
                );
            } else {
                console.error("Failed to delete job");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        } finally {
            setLoading(false);
        }
    }, []);

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
            startJob,
            deleteJob,
            stopJob,
            fetchJobsProgress,
            fetchJobStatus,
        }),
        [
            jobs,
            loading,
            startJob,
            deleteJob,
            stopJob,
            fetchJobsProgress,
            fetchJobStatus,
        ],
    );

    return (
        <JobsManagerContext.Provider value={contextValue}>
            {children}
        </JobsManagerContext.Provider>
    );
};

export default JobsManagerContextProvider;
