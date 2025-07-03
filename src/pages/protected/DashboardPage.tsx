import { useAuth } from "../../hooks/useAuth";

// Simple component for protected pages
const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome, {user ? user.username : "user"} !</h1>
            <p>This is a protected page.</p>
            <button
                onClick={logout}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;
