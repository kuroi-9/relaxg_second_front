import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as useAuthHook from "../../hooks/useAuth";
import LoginPage from "./LoginPage";
import { AxiosError, type AxiosResponse } from "axios";
// Use Chai's .exist matcher for DOM assertions

// Mock the useAuth hook
vi.mock("../../hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Login", () => {
    const useAuthSpy = vi.spyOn(useAuthHook, "useAuth");

    beforeEach(() => {
        vi.clearAllMocks();
        useAuthSpy.mockReturnValue({
            login: mockLogin,
            user: null,
            isAuthenticated: false,
            loading: false,
            logout: vi.fn(),
        });
    });

    const renderWithRouter = (ui) =>
        render(<BrowserRouter>{ui}</BrowserRouter>);

    it("renders the login form with French labels", () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByText("Connexion")).to.exist;
        expect(screen.getByPlaceholderText("Identifiant")).to.exist;
        expect(screen.getByPlaceholderText("Mot de passe")).to.exist;
        expect(screen.getByRole("button", { name: "Connexion" })).to.exist;
    });

    it("updates username input value", () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText("Identifiant");
        fireEvent.change(usernameInput, {
            target: { value: "testuser@relaxg.app" },
        });
        expect(usernameInput.value).toBe("testuser@relaxg.app");
    });

    it("updates password input value", () => {
        renderWithRouter(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        expect(passwordInput.value).toBe("testpassword");
    });

    it("filters out spaces from password input", () => {
        renderWithRouter(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        fireEvent.change(passwordInput, { target: { value: "test password" } });
        expect(passwordInput.value).toBe("");
    });

    it("displays error message when login fails", async () => {
        mockLogin.mockRejectedValueOnce(
            new AxiosError(undefined, undefined, undefined, undefined, {
                statusText: "Unauthorized",
                status: 401,
            } as AxiosResponse),
        );
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText("Identifiant");
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        const loginButton = screen.getByRole("button", {
            name: "Connexion",
        });
        fireEvent.change(usernameInput, {
            target: { value: "testuser@relaxg.app" },
        });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(
                screen.getByText("Unauthorized, please check your credentials"),
            ).to.exist;
        });
        expect(mockLogin).toHaveBeenCalledWith(
            "testuser@relaxg.app",
            "wrongpassword",
        );
    });

    it("navigates to dashboard on successful login", async () => {
        mockLogin.mockResolvedValueOnce({ success: true });
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText("Identifiant");
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        const loginButton = screen.getByRole("button", {
            name: "Connexion",
        });
        fireEvent.change(usernameInput, {
            target: { value: "testuser@relaxg.app" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "correctpassword" },
        });
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
        expect(mockLogin).toHaveBeenCalledWith(
            "testuser@relaxg.app",
            "correctpassword",
        );
    });

    it("clears error message on new submit attempt", async () => {
        mockLogin.mockRejectedValueOnce(
            new AxiosError(undefined, undefined, undefined, undefined, {
                statusText: "Unauthorized",
                status: 401,
            } as AxiosResponse),
        );
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText("Identifiant");
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        const loginButton = screen.getByRole("button", {
            name: "Connexion",
        });
        // First failed attempt
        fireEvent.change(usernameInput, {
            target: { value: "testuser@relaxg.app" },
        });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(
                screen.getByText("Unauthorized, please check your credentials"),
            ).to.exist;
        });
        // Second attempt should clear the error
        mockLogin.mockResolvedValueOnce({ success: true });
        fireEvent.change(passwordInput, {
            target: { value: "correctpassword" },
        });
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(
                screen.queryByText(
                    "Login failed. Please check your credentials.",
                ),
            ).to.not.exist;
        });
    });

    it("has required attributes on inputs", () => {
        renderWithRouter(<LoginPage />);
        const usernameInput = screen.getByPlaceholderText("Identifiant");
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        expect(usernameInput.hasAttribute("required")).to.be.true;
        expect(passwordInput.hasAttribute("required")).to.be.true;
        expect(passwordInput.getAttribute("type")).to.equal("password");
    });
});
