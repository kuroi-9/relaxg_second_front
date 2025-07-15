import { useAuth } from "../../../hooks/useAuth";
import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";

export default function LibraryPage() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    }

    return (
        <div className="grid ml-2 mr-2 border border-gray-200 rounded-md">
            <h1>Library</h1>
        </div>
    );
}
