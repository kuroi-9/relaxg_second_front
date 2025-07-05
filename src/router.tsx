import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Pages
import LoginPage from "./pages/auth/LoginPage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import HomePage from "./pages/HomePage.tsx";
// Layouts
import PrivateMainLayout from "./layouts/ProtectedMainLayout.tsx";
import PublicAuthLayout from "./layouts/PublicAuthLayout.tsx";

const router = createBrowserRouter([
    {
        element: <PublicAuthLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
        ],
    },
    {
        element: <PrivateMainLayout />,
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
