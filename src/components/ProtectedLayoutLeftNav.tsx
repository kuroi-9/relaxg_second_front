import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const LayoutLeftNav: React.FC<{
    toggleVisibilityParent: () => void;
}> = ({ toggleVisibilityParent }) => {
    const { logout } = useAuth();
    const [visible, setVisible] = useState(true);

    const toggleVisibility = () => {
        toggleVisibilityParent();
        setVisible(!visible);
    };

    if (!visible) {
        return (
            <button
                className="primary-button border"
                onClick={toggleVisibility}
            >
                &gt;
            </button>
        );
    }

    return (
        <div className="grid grid-rows-[3rem_1fr] gap-2 h-full">
            <button
                className="primary-button w-full border"
                onClick={toggleVisibility}
            >
                Hide
            </button>
            <nav
                className="grid grid-flow-rows grid-rows-[0.7rem, 0.7rem, 0.7rem, 1fr] gap-2 h-full border border-t-0 p-2"
                style={{ borderColor: "var(--background-color" }}
            >
                <Link to="/dashboard" className="borderless-primary-button">
                    Dashboard
                </Link>
                <Link to="/queues" className="borderless-primary-button">
                    Queues
                </Link>
                <Link to="/settings" className="borderless-primary-button">
                    Settings
                </Link>
                <button className="primary-button" onClick={logout}>
                    Logout
                </button>
            </nav>
        </div>
    );
};
