import React from "react";
import { Link } from "react-router-dom";

export const DashboardTopNav: React.FC = () => {
    return (
        <nav className="grid grid-cols-2 gap-2 m-2 border border-gray-200 rounded-md">
            <Link className="primary-button" to="/jobs">
                Jobs
            </Link>
            <Link className="primary-button" to="/library">
                Library
            </Link>
        </nav>
    );
};

export default DashboardTopNav;
