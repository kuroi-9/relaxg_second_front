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
        <div className="h-full border" style={{ borderColor: "gray" }}>
            {bookseries.length > 0 ? (
                <div className="grid grid-cols-5 gap-2 p-2">
                    {bookseries.map((bookserie) => (
                        <div key={bookserie.id} className="border p-2">
                            {bookserie.cover_image && (
                                <img
                                    src={bookserie.cover_image}
                                    alt={`${bookserie.title} cover`}
                                    className="w-full h-48 object-cover mb-2"
                                />
                            )}
                            <hr />
                            <h2>{bookserie.title}</h2>
                            {bookserie.description && (
                                <p className="text-sm text-gray-600">
                                    {bookserie.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No books found.</p>
            )}
        </div>
    );
}
