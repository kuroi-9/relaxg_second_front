import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axios";
import DashboardTopNav from "../../components/dashboard/DashboardTopNav";

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
        <div className="w-full">
            <DashboardTopNav />
        </div>
    );
}

export default DashboardPage;
