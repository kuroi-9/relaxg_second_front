import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/dashboard", { replace: true });
    }, [navigate]);

    return <p>Redirecting...</p>;
};

export default HomePage;
