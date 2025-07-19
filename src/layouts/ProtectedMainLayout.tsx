import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/ProtectedLayoutFooter";
import { LayoutLeftNav } from "../components/ProtectedLayoutLeftNav";
import LoadingComponent from "../components/auth/LoadingComponent";
import DashboardTopTabs from "../components/dashboard/DashboardTopTabs";
import JobsTab from "../pages/dashboard/jobs/JobsTab";
import LibraryTab from "../pages/dashboard/library/LibraryTab";

// Private (protected) layout
const PrivateMainLayout: React.FC = () => {
    const { isAuthenticated, loading } = useAuth(); // No need for logout here, it's handled in ProtectedPageContent

    if (loading) {
        return <LoadingComponent />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <div className="grid grid-rows-[1fr_5rem] gap-2 h-full">
                <div className="grid grid-cols-[10rem_1fr] gap-2 h-full">
                    {/* No header/footer to keep it ultra-minimal, just the Outlet */}
                    <LayoutLeftNav></LayoutLeftNav>
                    <div className="w-full border border-gray-200 rounded-md">
                        <DashboardTopTabs>
                            <div aria-label="Jobs">
                                <JobsTab />
                            </div>
                            <div aria-label="Library">
                                <LibraryTab />
                            </div>
                        </DashboardTopTabs>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </>
    );
};

export default PrivateMainLayout;
