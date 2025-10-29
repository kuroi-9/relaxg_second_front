import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/ProtectedLayoutFooter";
import { LayoutLeftNav } from "../components/ProtectedLayoutLeftNav";
import LoadingComponent from "../components/auth/LoadingComponent";
import DashboardTopTabs from "../components/dashboard/DashboardTopTabs";
import JobsTab from "../pages/dashboard/jobs/JobsTab";
import LibraryTab from "../pages/dashboard/library/LibraryTab";
import { useState } from "react";
import LibraryProvider from "../contexts/LibraryContext";

// Private (protected) layout
const PrivateMainLayout: React.FC = () => {
    const { isAuthenticated, loading } = useAuth(); // No need for logout here, it's handled in ProtectedPageContent
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (loading) {
        return <LoadingComponent />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const toggleVisibilityParent = (): void => {
        const mainContent = document.getElementById("main-content");
        const mainContainer = document.getElementById("main-container");

        if (mainContent && mainContainer) {
            if (isFullScreen) {
                mainContent.className =
                    "grid grid-rows-1 grid-cols-[10rem_1fr] gap-2 h-full";
                mainContainer.className =
                    "grid grid-rows-[1fr_5rem] gap-2 h-full";
            } else {
                mainContent.className =
                    "grid grid-rows-1 grid-cols-[min-content_1fr] gap-2 h-full";
                mainContainer.className = "grid grid-rows-1 gap-2 h-full";
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    return (
        <>
            <div
                id="main-container"
                className="grid grid-rows-[1fr_5rem] gap-2 h-full"
            >
                <div
                    id="main-content"
                    className="grid grid-rows-1 grid-cols-[10rem_1fr] gap-2 h-full"
                >
                    {/* No header/footer to keep it ultra-minimal, just the Outlet */}
                    <LayoutLeftNav
                        toggleVisibilityParent={toggleVisibilityParent}
                    ></LayoutLeftNav>
                    <div
                        className="w-full border"
                        style={{ borderColor: "var(--background-color" }}
                    >
                        <DashboardTopTabs>
                            <div aria-label="Jobs">
                                <JobsTab />
                            </div>
                            <div aria-label="Library">
                                <LibraryProvider>
                                    <LibraryTab />
                                </LibraryProvider>
                            </div>
                        </DashboardTopTabs>
                    </div>
                </div>
                {!isFullScreen && <Footer></Footer>}
            </div>
        </>
    );
};

export default PrivateMainLayout;
