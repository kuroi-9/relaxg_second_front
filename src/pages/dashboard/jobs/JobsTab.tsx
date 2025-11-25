import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { TitleBooks } from "../../../components/library/TitleBooks";
import { useAuth } from "../../../hooks/useAuth";
import { useJobsManager } from "../../../hooks/useJobsManager";
import { useState, useEffect, useCallback } from "react";
import type { Job } from "../../../types";

export type JobPercentage = {
    title_name: string;
    percentages: number[];
};

export type JobStatus = {
    job_id: number;
    status: string;
};

export default function JobsTab() {
    const { isAuthenticated } = useAuth();
    const {
        jobs,
        loading,
        startJob,
        deleteJob,
        stopJob,
        fetchJobsProgress,
        fetchJobStatus,
    } = useJobsManager();
    const [percentages, setPercentages] = useState<JobPercentage[]>([]);
    const [jobStatus, setJobStatus] = useState<JobStatus[]>([]);

    const handleStartJob = (jobId: number) => {
        console.log(`Starting job with ID: ${jobId}`);
        startJob(jobId).then((res) => {
            if (res) {
                fetchJobsStatus();
            }
        });
    };

    const handleStopJob = (jobId: number) => {
        console.log(`Stopping job with ID: ${jobId}`);
        stopJob(jobId).then((res) => {
            if (res) {
                fetchJobsStatus();
            }
        });
    };

    const handleDeleteJob = (jobId: number) => {
        console.log(`Deleting job with ID: ${jobId}`);
        deleteJob(jobId);
    };

    const fetchJobsStatus = useCallback(() => {
        console.log(jobs);
        Object.values(jobs).forEach((job) => {
            fetchJobStatus(job.id).then((status) => {
                console.log(`Job ${job.id} status: ${status?.status}`);
                setJobStatus((prevJobStatus) => {
                    const existingIndex = prevJobStatus.findIndex(
                        (item) => item.job_id === job.id,
                    );

                    if (existingIndex !== -1) {
                        const updatedStatus = [...prevJobStatus];
                        updatedStatus[existingIndex] = {
                            job_id: job.id,
                            status: status?.status || "unknown",
                        };
                        return updatedStatus;
                    } else {
                        return [
                            ...prevJobStatus,
                            {
                                job_id: job.id,
                                status: status?.status || "unknown",
                            },
                        ];
                    }
                });
            });
        });
    }, [jobs, fetchJobStatus]);

    useEffect(() => {
        const socket = new WebSocket(
            "ws://" + window.location.host.split(":")[0] + ":8000/ws/process/",
        );
        fetchJobsStatus();

        socket.onopen = function () {
            console.log("WebSocket connection opened");
            fetchJobsProgress();
        };

        socket.onclose = function () {
            console.log("WebSocket connection closed");
        };

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data.message);
            if (data.title_name && data.percentages) {
                setPercentages((prevPercentages) => {
                    const existingIndex = prevPercentages.findIndex(
                        (item) => item.title_name === data.title_name,
                    );
                    const newPercentages = data.percentages
                        .split("|")
                        .map(Number);

                    if (existingIndex !== -1) {
                        const updatedPercentages = [...prevPercentages];
                        updatedPercentages[existingIndex] = {
                            title_name: data.title_name,
                            percentages: newPercentages,
                        };
                        return updatedPercentages;
                    } else {
                        return [
                            ...prevPercentages,
                            {
                                title_name: data.title_name,
                                percentages: newPercentages,
                            },
                        ];
                    }
                });
            }
        };

        return () => socket.close();
    }, [fetchJobsProgress, jobs, fetchJobsStatus]);

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        if (loading) {
            console.log("Loading...");
        } else {
            console.log("Not loading");
            console.log("Access granted to JobsTab");
        }
    }

    return (
        <div
            className="grid h-full border"
            style={{ borderColor: "var(--background)" }}
        >
            {loading ? (
                <div>Loading...</div>
            ) : (
                jobs.map((job, index) => (
                    <section key={index} className="mb-2">
                        <div className="mb-2">
                            <p className="mb-2">{job.title_name}</p>
                            <div className="flex gap-2 justify-center mb-2">
                                <button
                                    className="primary-button"
                                    onClick={() => handleStartJob(job.id)}
                                >
                                    Start
                                </button>
                                <button
                                    className="primary-button"
                                    onClick={() => handleStopJob(job.id)}
                                >
                                    Stop
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteJob(job.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <p className="border p-2 w-1/2">
                                    Status:{" "}
                                    {
                                        jobStatus.find(
                                            (status) =>
                                                status.job_id === job.id,
                                        )?.status
                                    }
                                </p>
                            </div>
                        </div>
                        <TitleBooks
                            title_name={job.title_name}
                            percentages={
                                percentages.find(
                                    (item) =>
                                        item.title_name === job.title_name,
                                )?.percentages
                            }
                        />
                        {index < jobs.length - 1 && <hr />}
                    </section>
                ))
            )}
        </div>
    );
}
