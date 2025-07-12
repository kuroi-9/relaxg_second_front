import { useAuth } from "../../hooks/useAuth";
import DashboardTopNav from "../../components/dashboard/DashboardTopNav";

function DashboardPage() {
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
        <div className="w-full">
            <DashboardTopNav />
        </div>
    );
}

export default DashboardPage;
