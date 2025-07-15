import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardTopNav from "../../components/dashboard/DashboardTopNav";

const DashboardLayout: React.FC = () => {
    const { isAuthenticated, loading } = useAuth(); // No need for logout here, it's handled in ProtectedPageContent

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                Chargement de l'authentification...
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <div className="grid grid-rows-[auto_1fr] gap-2 pt-2 pb-2 h-full">
                <DashboardTopNav />
                <Outlet />
            </div>
        </>
    );
};

export default DashboardLayout;
