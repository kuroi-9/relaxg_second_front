import axios from "../api/axios";
import type { User } from "../types";

const AuthService = {
    async login(username: string, password: string): Promise<User | null> {
        const response = await axios
            .post<{ user?: User }>("/token/", {
                username,
                password,
            })
            .catch((error) => {
                console.error(
                    "Login failed:",
                    error.response?.data || error.message,
                );
                throw error;
            });
        return response.data.user || null;
    },

    async logout(): Promise<void> {
        await axios.post("/logout/").catch((error) => {
            console.error(
                "Logout failed:",
                error.response?.data || error.message,
            );
            throw error;
        });
    },

    async getUserInfo(): Promise<User | null> {
        const response = await axios.get<User>("/user/me/").catch((error) => {
            console.error(
                "Failed to get user info:",
                error.response?.data || error.message,
            );
            throw error;
        });

        if (
            response.data &&
            typeof response.data === "object" &&
            "id" in response.data &&
            "username" in response.data &&
            "email" in response.data &&
            "first_name" in response.data &&
            "last_name" in response.data &&
            "scan_directory" in response.data
        ) {
            console.log(response.data);
            return response.data;
        } else {
            throw new Error("Invalid user data received");
        }
    },
};

export default AuthService;
