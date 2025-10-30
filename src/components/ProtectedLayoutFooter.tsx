import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer
            className="border"
            style={{ borderColor: "var(--background)", marginBottom: "5rem" }}
        >
            <p className="text-center">Footer content</p>
        </footer>
    );
};

export default Footer;
