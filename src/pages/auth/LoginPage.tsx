import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { login } = useAuth(); // Retrieves the typed 'login' function from the context

    const handleSubmit = async (e: React.FormEvent) => {
        // Type for the form event
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            // Type for the error
            setError("Login failed. Please check your credentials.");
            console.error("Login failed:", err);
        }
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Login page
            </h2>
            {error && (
                <p
                    style={{
                        color: "red",
                        textAlign: "center",
                        marginBottom: "15px",
                    }}
                >
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="username"
                        style={{ display: "block", marginBottom: "5px" }}
                    >
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUsername(e.target.value)
                        } // Type for the onChange event
                        required
                        style={{
                            width: "100%",
                            padding: "8px",
                            boxSizing: "border-box",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label
                        htmlFor="password"
                        style={{ display: "block", marginBottom: "5px" }}
                    >
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        } // Type for the onChange event
                        required
                        style={{
                            width: "100%",
                            padding: "8px",
                            boxSizing: "border-box",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
