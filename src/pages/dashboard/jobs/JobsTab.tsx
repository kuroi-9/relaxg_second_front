import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useAuth } from "../../../hooks/useAuth";
import { useJobsManager } from "../../../hooks/useJobsManager";

export default function JobsTab() {
    const { isAuthenticated } = useAuth();
    const { jobs, loading, startJob } = useJobsManager();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        console.log(loading);
        console.log("Access granted to JobsTab");
    }

    const handleStartJob = (jobId: number) => {
        console.log(`Starting job with ID: ${jobId}`);
        startJob(jobId);
    };

    return (
        <div
            className="grid h-full border"
            style={{ borderColor: "var(--background)" }}
        >
            {loading ? (
                <div>Loading...</div>
            ) : (
                jobs.map((job) => (
                    <div key={job.id}>
                        <p>{job.title_name}</p>
                        <button onClick={() => handleStartJob(job.id)}>
                            Start
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
