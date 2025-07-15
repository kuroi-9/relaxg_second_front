import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useAuth } from "../../../hooks/useAuth";

export default function JobsPage() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    }

    return (
        <div className="grid ml-2 mr-2 border border-gray-200 rounded-md">
            <h1>Jobs</h1>
        </div>
    );
}
