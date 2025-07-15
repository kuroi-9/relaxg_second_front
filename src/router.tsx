import React from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
// Pages
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import JobsPage from "./pages/dashboard/jobs/JobsPage.tsx";
import LibraryPage from "./pages/dashboard/library/LibraryPage.tsx";
// Layouts
import PrivateMainLayout from "./layouts/ProtectedMainLayout.tsx";
import PublicAuthLayout from "./layouts/PublicAuthLayout.tsx";
import DashboardLayout from "./layouts/dashboard/DashboardLayout.tsx";

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
        children: [
            {
                path: "/dashboard",
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/dashboard/jobs" replace />, // Redirect to jobs page by default
                    },
                    { path: "/dashboard/jobs", element: <JobsPage /> },
                    { path: "/dashboard/library", element: <LibraryPage /> },
                ],
            },
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
