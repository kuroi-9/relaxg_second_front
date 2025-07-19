import { useAuth } from "../../../hooks/useAuth";
import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";

export default function LibraryTab() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        console.log("Access granted to LibraryTab");
    }

    return (
        <div className="grid h-full border border-gray-200 rounded-md">
            <h1>Library</h1>
        </div>
    );
}
