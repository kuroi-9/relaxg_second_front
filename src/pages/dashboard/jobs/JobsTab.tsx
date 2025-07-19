import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useAuth } from "../../../hooks/useAuth";

export default function JobsTab() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        console.log("Access granted to JobsTab");
    }

    return (
        <div className="grid h-full border border-gray-200 rounded-md">
            <h1>Jobs</h1>
        </div>
    );
}
