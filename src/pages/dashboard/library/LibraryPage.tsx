import { useAuth } from "../../../hooks/useAuth";

export default function LibraryPage() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <p>
                Vous n'êtes pas connecté. Veuillez vous rendre sur la page de
                connexion.
            </p>
        );
    }

    return (
        <div className="grid ml-2 mr-2 border border-gray-200 rounded-md">
            <h1>Library</h1>
        </div>
    );
}
