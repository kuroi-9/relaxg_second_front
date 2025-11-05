import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useAuth } from "../../../hooks/useAuth";
import { useJobsManager } from "../../../hooks/useJobsManager";

export default function JobsTab() {
    const { isAuthenticated } = useAuth();
    const { jobs, loading } = useJobsManager();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
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
                jobs.map((job) => <div key={job.id}>{job.title}</div>)
            )}
        </div>
    );
}
