import React from "react";

interface TabProps {
    activeTab: string;
    label: string;
    onClick: (tabLabel: string) => void;
}

const Tab: React.FC<TabProps> = ({ activeTab, label, onClick }) => {
    const handleClick = () => {
        onClick(label);
    };

    let className = "primary-button";

    if (activeTab === label) {
        className += " active-link";
    }

    return (
        <li className={className} onClick={handleClick}>
            {label}
        </li>
    );
};

export default Tab;
