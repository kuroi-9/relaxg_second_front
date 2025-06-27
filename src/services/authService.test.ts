import { describe, it, expect, beforeEach } from "vitest";
import authService from "./authService";
import apiClient from "./api";
import { server } from "../setupTests"; // Ensure that setupTests is properly configured
import { http, HttpResponse } from "msw"; // Import these two to modify the handlers in the tests

describe("authService", () => {
    beforeEach(() => {
        localStorage.clear();
        // Reset MSW handlers after each test to avoid interference
        server.resetHandlers();
    });

    it("should store tokens on successful login", async () => {
        const data = await authService.login("testuser", "password123");
        expect(data.access).toBe("mocked-access-token-for-testuser");
        expect(localStorage.getItem("access_token")).toBe(
            "mocked-access-token-for-testuser",
        );
        expect(localStorage.getItem("refresh_token")).toBe(
            "mocked-refresh-token-for-testuser",
        );
    });

    it("should throw an error on failed login", async () => {
        await expect(
            authService.login("wronguser", "wrongpass"),
        ).rejects.toThrow();
        expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("should remove tokens on logout", () => {
        localStorage.setItem("access_token", "some-token");
        localStorage.setItem("refresh_token", "some-refresh");
        authService.logout();
        expect(localStorage.getItem("access_token")).toBeNull();
        expect(localStorage.getItem("refresh_token")).toBeNull();
    });

    it("should refresh token and store new access token", async () => {
        localStorage.setItem(
            "refresh_token",
            "mocked-refresh-token-for-testuser",
        );
        const newAccessToken = await authService.refreshToken();
        expect(newAccessToken).toBe("new-mocked-access-token-for-testuser");
        expect(localStorage.getItem("access_token")).toBe(
            "new-mocked-access-token-for-testuser",
        );
    });

    it("should logout if refresh token fails", async () => {
        localStorage.setItem("refresh_token", "invalid-refresh-token");
        localStorage.setItem("access_token", "old-access-token");
        await expect(authService.refreshToken()).rejects.toThrow();
        expect(localStorage.getItem("access_token")).toBeNull();
        expect(localStorage.getItem("refresh_token")).toBeNull();
    });

    it("apiClient should add Authorization header if token exists", async () => {
        localStorage.setItem(
            "access_token",
            "mocked-access-token-for-testuser",
        );
        const response = await apiClient.get("/hello-protected/");
        expect(response.data.message).toBe(
            "Hello, mocked_user! You are authenticated.",
        );
    });

    it("apiClient should try to refresh token on 401 and retry original request", async () => {
        // 1. Simulate an initial 401 response for the protected view
        server.use(
            http.get(
                `${import.meta.env.VITE_BASE_URL}/hello-protected/`,
                async ({ request }) => {
                    const authHeader = request.headers.get("Authorization");
                    if (
                        authHeader === "Bearer expired-access-token" &&
                        !request.url.toString().includes("_retry=true")
                    ) {
                        // Simulate the first 401
                        return HttpResponse.json(
                            { detail: "Token expired" },
                            { status: 401 },
                        );
                    }
                    // This is the response for the retried request after refresh
                    if (
                        authHeader ===
                        "Bearer new-mocked-access-token-for-testuser"
                    ) {
                        return HttpResponse.json(
                            {
                                message:
                                    "Hello, mocked_user! You are authenticated.",
                            },
                            { status: 200 },
                        );
                    }
                    return HttpResponse.json(
                        {
                            detail: "Authentication credentials were not provided.",
                        },
                        { status: 401 },
                    );
                },
            ),
        );

        localStorage.setItem("access_token", "expired-access-token"); // Le token qui causera le 401
        localStorage.setItem(
            "refresh_token",
            "mocked-refresh-token-for-testuser",
        ); // The valid refresh token

        const response = await apiClient.get("/hello-protected/");

        expect(response.data.message).toBe(
            "Hello, mocked_user! You are authenticated.",
        );
        expect(localStorage.getItem("access_token")).toBe(
            "new-mocked-access-token-for-testuser",
        );
    });
});
