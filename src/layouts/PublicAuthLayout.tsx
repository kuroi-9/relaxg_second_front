import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicAuthLayout: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                Loading...
            </div>
        );
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />; // Redirect if already logged in
    }
    return <Outlet />; // Renders LoginPage
};

export default PublicAuthLayout;
