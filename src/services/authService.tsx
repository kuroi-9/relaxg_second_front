import axios from "../api/axios";
import { type User } from "../types";

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
        return response.data;
    },
};

export default AuthService;
