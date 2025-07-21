import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer
            className="border rounded-md"
            style={{ borderColor: "var(--background-color" }}
        >
            <p className="text-center">Footer content</p>
        </footer>
    );
};

export default Footer;
