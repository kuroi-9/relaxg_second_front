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
        <div
            className="grid h-full border"
            style={{ borderColor: "var(--background-color)" }}
        >
            <h1>Library</h1>
        </div>
    );
}
