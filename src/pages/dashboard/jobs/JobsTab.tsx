import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { TitleBooks } from "../../../components/library/TitleBooks";
import { useAuth } from "../../../hooks/useAuth";
import { useJobsManager } from "../../../hooks/useJobsManager";
import { useState, useEffect, useCallback } from "react";

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
                console.warn(`Job ${job.id} status: ${status?.status}`);
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
            if (data.success === true) {
                console.warn(data.message);
                fetchJobsStatus();
            }
            if (data.fail === true) {
                alert(data.message);
                fetchJobsStatus();
            }
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
                    <section
                        key={index}
                        className={`${index === 0 ? "mt-0" : "mt-4"} p-2 border border-gray-500`}
                    >
                        <div className="mb-2">
                            <p className="mb-2 p-2 underline">
                                {job.title_name}
                            </p>
                            <div className="flex justify-center mb-2">
                                <p
                                    className={`border p-2 w-full ${
                                        jobStatus.find(
                                            (status) =>
                                                status.job_id === job.id,
                                        )?.status === "Running"
                                            ? "loader-bar"
                                            : ""
                                    }`}
                                    style={
                                        jobStatus.find(
                                            (status) =>
                                                status.job_id === job.id,
                                        )?.status === "Running"
                                            ? {
                                                  backgroundColor: "green",
                                                  border: "1px solid green",
                                                  transition: "all 0.3s ease",
                                              }
                                            : {
                                                  borderColor: "gray",
                                                  transition: "all 0.3s ease",
                                              }
                                    }
                                >
                                    {jobStatus.find(
                                        (status) => status.job_id === job.id,
                                    )?.status || "N/A"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="primary-button flex-1"
                                    onClick={() => handleStartJob(job.id)}
                                >
                                    Start
                                </button>
                                <button
                                    className="primary-button flex-1"
                                    onClick={() => handleStopJob(job.id)}
                                >
                                    Stop
                                </button>
                                <button
                                    className="delete-button flex-1"
                                    onClick={() => handleDeleteJob(job.id)}
                                >
                                    Delete
                                </button>
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
                            padding={0}
                            gapless={true}
                        />
                    </section>
                ))
            )}
        </div>
    );
}
