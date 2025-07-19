import { http, HttpResponse } from "msw";

const API_URL =
    import.meta.env.VITE_API_URL_DEV_OVER_NETWORK ||
    import.meta.env.VITE_API_URL;

export const handlers = [
    http.post(`${API_URL}/token/`, async ({ request }) => {
        const { username, password } = (await request.json()) as {
            username?: string;
            password?: string;
        };
        if (username === "testuser" && password === "password123") {
            return HttpResponse.json(
                {
                    access: "mocked-access-token-for-testuser",
                    refresh: "mocked-refresh-token-for-testuser",
                },
                { status: 200 },
            );
        }
        return HttpResponse.json(
            { detail: "No active account found with the given credentials" },
            { status: 401 },
        );
    }),

    http.post(`${API_URL}/token/refresh/`, async ({ request }) => {
        const { refresh } = (await request.json()) as { refresh?: string };
        if (refresh === "mocked-refresh-token-for-testuser") {
            return HttpResponse.json(
                { access: "new-mocked-access-token-for-testuser" },
                { status: 200 },
            );
        }
        return HttpResponse.json(
            { detail: "Token is invalid or expired" },
            { status: 401 },
        );
    }),

    http.get(`${API_URL}/hello-protected/`, ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        if (
            authHeader === "Bearer mocked-access-token-for-testuser" ||
            authHeader === "Bearer new-mocked-access-token-for-testuser"
        ) {
            return HttpResponse.json(
                { message: "Hello, mocked_user! You are authenticated." },
                { status: 200 },
            );
        }
        return HttpResponse.json(
            { detail: "Authentication credentials were not provided." },
            { status: 401 },
        );
    }),
];
