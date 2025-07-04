import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as useAuthHook from "../../hooks/useAuth";
import LoginPage from "./LoginPage";

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

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    it("should render the login form with French labels", () => {
        renderWithRouter(<LoginPage />);

        expect(screen.getByText("Connexion")).toBeTruthy();
        expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeTruthy();
        expect(screen.getByLabelText(/mot de passe/i)).toBeTruthy();
        expect(
            screen.getByRole("button", { name: /se connecter/i }),
        ).toBeTruthy();
    });

    it("should update username input value", () => {
        renderWithRouter(<LoginPage />);

        const usernameInput = screen.getByLabelText(
            /nom d'utilisateur/i,
        ) as HTMLInputElement;
        fireEvent.change(usernameInput, { target: { value: "testuser" } });

        expect(usernameInput.value).toBe("testuser");
    });

    it("should update password input value", () => {
        renderWithRouter(<LoginPage />);

        const passwordInput = screen.getByLabelText(
            /mot de passe/i,
        ) as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        expect(passwordInput.value).toBe("testpassword");
    });

    it("should filter out spaces from password input", () => {
        renderWithRouter(<LoginPage />);

        const passwordInput = screen.getByLabelText(
            /mot de passe/i,
        ) as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: "test password" } });

        expect(passwordInput.value).toBe("");
    });

    it("should display error message when login fails", async () => {
        mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

        renderWithRouter(<LoginPage />);

        const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
        const passwordInput = screen.getByLabelText(/mot de passe/i);
        const loginButton = screen.getByRole("button", {
            name: /se connecter/i,
        });

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Login failed. Please check your credentials.",
                ),
            ).toBeTruthy();
        });
        expect(mockLogin).toHaveBeenCalledWith("testuser", "wrongpassword");
    });

    it("should navigate to dashboard on successful login", async () => {
        mockLogin.mockResolvedValueOnce({ success: true });

        renderWithRouter(<LoginPage />);

        const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
        const passwordInput = screen.getByLabelText(/mot de passe/i);
        const loginButton = screen.getByRole("button", {
            name: /se connecter/i,
        });

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, {
            target: { value: "correctpassword" },
        });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
        expect(mockLogin).toHaveBeenCalledWith("testuser", "correctpassword");
    });

    it("should clear error message on new submit attempt", async () => {
        mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

        renderWithRouter(<LoginPage />);

        const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
        const passwordInput = screen.getByLabelText(/mot de passe/i);
        const loginButton = screen.getByRole("button", {
            name: /se connecter/i,
        });

        // First failed attempt
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Login failed. Please check your credentials.",
                ),
            ).toBeTruthy();
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
            ).toBeFalsy();
        });
    });

    it("should have required attributes on inputs", () => {
        renderWithRouter(<LoginPage />);

        const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
        const passwordInput = screen.getByLabelText(/mot de passe/i);

        expect(usernameInput.hasAttribute("required")).toBe(true);
        expect(passwordInput.hasAttribute("required")).toBe(true);
        expect(passwordInput.getAttribute("type")).toBe("password");
    });
});
