import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useAuth } from "../../../hooks/useAuth";
import { useJobsManager } from "../../../hooks/useJobsManager";
import { useEffect } from "react";

export default function JobsTab() {
    const { isAuthenticated } = useAuth();
    const { jobs, loading, startJob, deleteJob } = useJobsManager();

    const handleStartJob = (jobId: number) => {
        console.log(`Starting job with ID: ${jobId}`);
        startJob(jobId);
    };

    const handleDeleteJob = (jobId: number) => {
        console.log(`Deleting job with ID: ${jobId}`);
        deleteJob(jobId);
    };

    useEffect(() => {
        const socket = new WebSocket(
            "ws://" + window.location.host.split(":")[0] + ":8000/ws/process/",
        );

        socket.onopen = function () {
            console.log("WebSocket connection opened");
        };

        socket.onclose = function () {
            console.log("WebSocket connection closed");
        };

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data.message);
        };

        return () => socket.close();
    }, []);

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        console.log(loading);
        console.log("Access granted to JobsTab");
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
                    <section className="mb-2" key={job.id}>
                        <div className="mb-2" key={job.id}>
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
                                    onClick={() => handleDeleteJob(job.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <p className="border p-2 w-1/2">
                                    Status: {job.status}
                                </p>
                            </div>
                        </div>
                        {index < jobs.length - 1 && <hr />}
                    </section>
                ))
            )}
        </div>
    );
}
