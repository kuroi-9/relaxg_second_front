import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../../index.css";
import "./LoginPage.style.css";
import { AxiosError } from "axios";

function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            setIsLoading(true);
            const response = await login(username, password);
            console.log(response);
            setIsLoading(false);
        } catch (err) {
            const errorMessage = () => {
                if (err instanceof AxiosError) {
                    if (err.response && err.response.status === 401) {
                        // We only target 401 errors, not other BAD_REQUEST errors
                        return (
                            err.response.statusText +
                            ", please check your credentials"
                        );
                    } else if (err.code === "ECONNABORTED") {
                        return "Connection timed out";
                    } else if (err.code === "ERR_NETWORK") {
                        return "Please check your internet connection and the backend status";
                    } else {
                        return "An unknown error occurred";
                    }
                }
                return "An unknown error occurred";
            };
            setError(errorMessage());
            setIsLoading(false);
            console.error("Login component error:", err);
        }
    };

    return (
        <div className="grid grid-cols-1 grid-rows-[minmax(0,_7rem)_minmax(0,_1fr)_minmax(0,_7rem)_minmax(0,_7rem)] items-center justify-center">
            <h2 className="text-2xl">Connexion</h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-[min(30rem,_100%)] grid-rows-[1fr_1fr_auto_auto] gap-2 justify-center"
            >
                <div className="grid-form-input">
                    <div className="grid grid-cols-1 items-center justify-center">
                        <input
                            id="username"
                            type="email"
                            placeholder="Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="primary-input border-b outline-none h-10"
                        />
                    </div>
                </div>
                <div className="grid-form-input">
                    <div className="grid grid-cols-1 items-center justify-center">
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value.includes(" ")
                                        ? ""
                                        : e.target.value,
                                )
                            } // Filtering spaces as the user types
                            required
                            className="primary-input border-b outline-none h-10"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <hr
                        className="border-2 w-28"
                        style={{
                            borderColor: "var(--foreground)",
                        }}
                    />
                </div>
                {isLoading ? (
                    <button disabled type="submit" className="primary-button">
                        <div className="loader-white" />
                    </button>
                ) : (
                    <button type="submit" className="primary-button">
                        Se connecter
                    </button>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            {/*<h4 className="text-center">
        Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
      </h4>*/}
            <div className="flex justify-center">
                <h4 className="italic">Relaxg : The Second</h4>
            </div>
        </div>
    );
}

export default LoginPage;
