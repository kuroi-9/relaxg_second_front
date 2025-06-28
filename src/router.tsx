import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Pages
import LoginPage from "./pages/Auth/LoginPage.tsx";

// Simple component for protected pages
const ProtectedPageContent: React.FC = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome, {user ? user.username : "user"} !</h1>
            <p>This is a protected page.</p>
            <button
                onClick={logout}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
        </div>
    );
};

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

// Public layout (for the login page)
const PublicAuthLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
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

const router = createBrowserRouter([
    {
        element: <PublicAuthLayout />,
        children: [{ path: "/login", element: <LoginPage /> }],
    },
    {
        element: <PrivateLayout />,
        children: [
            { path: "/", element: <ProtectedPageContent /> },
            { path: "/dashboard", element: <ProtectedPageContent /> },
        ],
    },
    {
        path: "*",
        element: (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h1>404 - Page Not Found</h1>
            </div>
        ),
    },
]);

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
