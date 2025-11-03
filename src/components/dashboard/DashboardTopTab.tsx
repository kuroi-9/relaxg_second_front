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

    let className = "";

    if (activeTab.toLocaleLowerCase() === label.toLocaleLowerCase()) {
        className += " primary-button";
    } else {
        className += " borderless-primary-button";
    }

    return (
        <li className={className} onClick={handleClick}>
            {label}
        </li>
    );
};

export default Tab;
