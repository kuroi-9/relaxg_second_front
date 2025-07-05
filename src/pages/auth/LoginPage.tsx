import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import "./LoginPage.style.css";
import { Link } from "react-router-dom";

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
        <div className="h-screen grid items-center">
            <div className="grid grid-rows-[minmax(0,_7rem)_minmax(0,_1fr)_minmax(0,_7rem)_minmax(0,_7rem)] items-center justify-center">
                <h2 className="mid-heading">Connexion</h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-rows-[1fr_1fr_1fr] gap-2 w-1/4"
                >
                    <div className="grid-form-input">
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
                    <div className="grid-form-input">
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
                    <button type="submit" className="primary-button">
                        Se connecter
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
                <h4 className="text-center">
                    Pas encore de compte ?{" "}
                    <Link to="/register">Inscrivez-vous</Link>
                </h4>
                <div className="flex justify-center">
                    <h4 className="italic text-amber-100">
                        Relaxg : The Second
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
