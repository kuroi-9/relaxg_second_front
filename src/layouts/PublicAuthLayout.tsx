import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingComponent from "../components/auth/LoadingComponent";

const PublicAuthLayout: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingComponent />;
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />; // Redirect if already logged in
    }
    return <Outlet />; // Renders LoginPage
};

export default PublicAuthLayout;
