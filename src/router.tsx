import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Pages
import LoginPage from "./pages/auth/LoginPage.tsx";
import DashboardPage from "./pages/protected/DashboardPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import PrivateLayout from "./pages/protected/Layout.tsx";

// Public layout (for the login page)
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

const router = createBrowserRouter([
    {
        element: <PublicAuthLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
        ],
    },
    {
        element: <PrivateLayout />,
        children: [{ path: "/dashboard", element: <DashboardPage /> }],
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
