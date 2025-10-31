import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LayoutBottomNav } from "../components/ProtectedLayoutBottomNav";
import Footer from "../components/ProtectedLayoutFooter";
import LoadingComponent from "../components/auth/LoadingComponent";
import DashboardTopTabs from "../components/dashboard/DashboardTopTabs";
import LibraryProvider from "../contexts/LibraryContext";
import { useAuth } from "../hooks/useAuth";
import JobsTab from "../pages/dashboard/jobs/JobsTab";
import LibraryTab from "../pages/dashboard/library/LibraryTab";

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
                    "grid grid-rows-1 grid-cols-[1fr] gap-2 h-full";
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
                className="grid grid-rows-[1fr_10rem] gap-2 h-full"
                style={{ marginTop: "4rem" }}
            >
                <div
                    id="main-content"
                    className="grid grid-rows-1 grid-cols[1fr] gap-2 h-full"
                >
                    {/* No header/footer to keep it ultra-minimal, just the Outlet */}
                    <LayoutBottomNav
                        toggleVisibilityParent={toggleVisibilityParent}
                    ></LayoutBottomNav>
                    <div
                        className="w-full border"
                        style={{
                            borderColor: "var(--background)",
                        }}
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
