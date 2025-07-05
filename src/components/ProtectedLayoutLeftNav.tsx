import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const LayoutLeftNav: React.FC = () => {
    const { logout } = useAuth();

    return (
        <nav className="grid grid-flow-rows grid-rows-[0.7rem, 0.7rem, 0.7rem, 1fr] gap-6 h-full border border-gray-200 rounded-md">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/queues">Queues</Link>
            <Link to="/settings">Settings</Link>
            <button className="primary-button" onClick={logout}>
                Logout
            </button>
        </nav>
    );
};
