import React from "react";
import { Link, useLocation } from "react-router-dom";

export const DashboardTopNav: React.FC = () => {
    const location = useLocation();

    const getLinkClasses = (path: string) => {
        return `primary-button ${location.pathname.startsWith(path) ? "active-link" : ""}`;
    };

    return (
        <nav className="grid grid-cols-2 gap-2 ml-2 mr-2 border border-gray-200 z-50">
            <Link
                className={getLinkClasses("/dashboard/jobs")}
                to="/dashboard/jobs"
                style={{ position: "fixed", top: "0" }}
            >
                Jobs
            </Link>
            <Link
                className={getLinkClasses("/dashboard/library")}
                to="/dashboard/library"
            >
                Library
            </Link>
        </nav>
    );
};

export default DashboardTopNav;
