import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const LayoutBottomNav: React.FC<{
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
        <div
            className="grid grid-cols-[1fr] w-full z-10 border-t"
            style={{
                position: "fixed",
                left: 0,
                bottom: 0,
                backgroundColor: "var(--background)",
            }}
        >
            {/*<button
                className="primary-button w-full border"
                onClick={toggleVisibility}
            >
                Hide
            </button>*/}
            <nav
                className="grid grid-flow-col md:justify-center gap-2 p-2 overflow-x-scroll"
                style={{ borderColor: "var(--background)" }}
            >
                <Link
                    to="/dashboard"
                    className="borderless-primary-button md:w-min"
                >
                    Dashboard
                </Link>
                <Link
                    to="/queues"
                    className="borderless-primary-button md:w-min"
                >
                    Queues
                </Link>
                <Link
                    to="/settings"
                    className="borderless-primary-button md:w-min"
                >
                    Settings
                </Link>
                <button className="primary-button md:w-min" onClick={logout}>
                    Logout
                </button>
            </nav>
        </div>
    );
};
