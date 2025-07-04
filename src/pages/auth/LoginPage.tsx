import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.style.css";

function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await login(username, password);
            console.log(response);
            navigate("/dashboard");
        } catch (err) {
            const errorMessage = "Login failed. Please check your credentials.";
            setError(errorMessage);
            console.error("Login component error:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="mid-heading">Connexion</h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-rows-[1fr_1fr_1fr] gap-2 w-1/5"
            >
                <div className="grid grid-cols-[10rem_1fr] p-4 border border-zinc-700 rounded-md">
                    <div className="flex items-center">
                        <label htmlFor="username" className="text-start">
                            Identifiant
                        </label>
                    </div>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border-b outline-none"
                    />
                </div>
                <div className="grid grid-cols-[10rem_1fr] p-4 border border-zinc-700 rounded-md">
                    <div className="flex items-center">
                        <label htmlFor="password" className="text-start">
                            Mot de passe
                        </label>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value.includes(" ")
                                    ? ""
                                    : e.target.value,
                            )
                        } // Filtering spaces as the user types
                        required
                        className="border-b outline-none"
                    />
                </div>
                <button type="submit">Se connecter</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}

export default LoginPage;
