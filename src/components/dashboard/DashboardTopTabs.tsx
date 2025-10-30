import React, { Component, type ReactNode } from "react";
import Tab from "./DashboardTopTab";

interface TabChildProps {
    "aria-label": string;
    children: ReactNode;
}

interface TabsProps {
    children: React.ReactElement<TabChildProps>[];
}

interface TabsState {
    activeTab: string;
}

class DashboardTopTabs extends Component<TabsProps, TabsState> {
    constructor(props: TabsProps) {
        super(props);

        this.state = {
            activeTab: this.props.children[0].props["aria-label"],
        };
    }

    onClickTabItem = (tab: string) => {
        this.setState({ activeTab: tab });
    };

    render() {
        const {
            onClickTabItem,
            props: { children },
            state: { activeTab },
        } = this;

        return (
            <div
                className="tabs p-2 h-full grid grid-rows-[auto_1fr] gap-2"
                style={{
                    border: "1px solid gray",
                }}
            >
                <ol
                    className="tab-list w-full grid grid-cols-2 gap-2 border-b p-2"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 10,
                        backgroundColor: "var(--background)",
                    }}
                >
                    {children.map((child) => {
                        const { ["aria-label"]: label } = child.props;

                        return (
                            <Tab
                                activeTab={activeTab}
                                key={label}
                                label={label}
                                onClick={onClickTabItem}
                            />
                        );
                    })}
                </ol>
                <div className="tab-content h-full">
                    {children.map((child) => {
                        if (child.props["aria-label"] !== activeTab)
                            return undefined;
                        return child.props.children;
                    })}
                </div>
            </div>
        );
    }
}

export default DashboardTopTabs;
