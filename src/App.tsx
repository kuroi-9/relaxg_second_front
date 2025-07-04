import AppRouter from "./router.tsx"; // The extension of the file is important here to avoid confusion and bad import statements.
import "./App.css";

import { useEffect } from "react";
import axiosInstance from "./api/axios.ts";
import Cookies from "js-cookie";

function App() {
    useEffect(() => {
        const checkAndFetchCsrfToken = async () => {
            if (!Cookies.get("csrftoken")) {
                console.log(
                    "CSRF token not found, attempting to fetch from Django...",
                );
                try {
                    // Cible la nouvelle vue spécifique pour le CSRF
                    await axiosInstance.get("/get-csrf-token/");
                    console.log(
                        "CSRF token fetched successfully via GET request to Django.",
                    );
                } catch (error) {
                    console.error(
                        "Failed to fetch CSRF token from Django:",
                        error,
                    );
                }
            } else {
                console.log("CSRF token already present.");
            }
        };

        checkAndFetchCsrfToken();
    }, []);

    return <AppRouter />;
}

export default App;
