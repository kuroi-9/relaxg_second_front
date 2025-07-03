import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Private (protected) layout
const PrivateLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth(); // No need for logout here, it's handled in ProtectedPageContent

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                Loading authentication...
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {/* No header/footer to keep it ultra-minimal, just the Outlet */}
            <Outlet />
        </>
    );
};

export default PrivateLayout;
