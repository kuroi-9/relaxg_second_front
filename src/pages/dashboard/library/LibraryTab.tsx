import { useAuth } from "../../../hooks/useAuth";
import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useLibrary } from "../../../hooks/useLibrary";

export default function LibraryTab() {
    const { isAuthenticated } = useAuth();
    const { bookseries } = useLibrary();

    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        console.log("Access granted to LibraryTab");
    }

    return (
        <div
            className="h-full border"
            style={{ borderColor: "var(--background-color)" }}
        >
            {bookseries.length > 0 ? (
                <div className="grid">
                    {bookseries.map((bookserie) => (
                        <div key={bookserie.id}>
                            <h2>{bookserie.title}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No books found.</p>
            )}
        </div>
    );
}
