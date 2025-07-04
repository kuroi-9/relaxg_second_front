import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axios";

function DashboardPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const [protectedData, setProtectedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchProtectedData = async () => {
        setError(null);
        try {
            const response = await axiosInstance.get<{ message: string }>(
                "/protected-data/",
            );
            setProtectedData(response.data.message);
        } catch {
            setError("Failed to fetch protected data. Please try again.");
        }
    };

    if (!isAuthenticated) {
        return (
            <p>
                Vous n'êtes pas connecté. Veuillez vous rendre sur la page de
                connexion.
            </p>
        );
    }

    return (
        <div>
            <h1>Tableau de bord</h1>
            {user && <p>Bienvenue, {user.username}!</p>}
            <button onClick={logout}>Déconnexion</button>

            <h2>Données Protégées</h2>
            <button onClick={fetchProtectedData}>
                Charger les données protégées
            </button>
            {protectedData ? (
                <p>{protectedData}</p>
            ) : (
                <p>Aucune donnée chargée pour l'instant.</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default DashboardPage;
