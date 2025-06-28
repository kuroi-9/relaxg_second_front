import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as useAuthHook from "../../hooks/useAuth";
import LoginPage from "./LoginPage";

// Mock the useAuth hook
vi.mock("../../hooks/useAuth", () => ({
    // Mocking the useAuth hook to control its behavior in tests
    useAuth: vi.fn(),
}));

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    // Mocking the useNavigate function from react-router-dom
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("LoginPage", () => {
    const useAuthSpy = vi.spyOn(useAuthHook, "useAuth"); // Creating a spy on the useAuth hook to mock its return values

    beforeEach(() => {
        vi.clearAllMocks(); // Clearing all mocks before each test to ensure no state leakage between tests
        useAuthSpy.mockReturnValue({
            login: mockLogin, // Mocking the login function to simulate login behavior
            user: null,
            isAuthenticated: false,
            isLoading: false,
            logout: vi.fn(),
        });
    });

    const renderWithRouter = (ui: React.ReactElement) => {
        // Utility function to render components with a BrowserRouter context
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    it("should render the login form", () => {
        renderWithRouter(<LoginPage />); // Rendering the LoginPage component for testing

        expect(screen.getByLabelText(/username/i)).toBeTruthy(); // Verifying that the username input field is present
        expect(screen.getByLabelText(/password/i)).toBeTruthy(); // Verifying that the password input field is present
        expect(screen.getByRole("button", { name: /login/i })).toBeTruthy(); // Verifying that the login button is present
    });

    it("should display an error message if login fails", async () => {
        mockLogin.mockRejectedValueOnce(new Error("Invalid credentials")); // Simulating a failed login attempt

        renderWithRouter(<LoginPage />);

        const usernameInput = screen.getByLabelText(/username/i); // Selecting the username input field
        const passwordInput = screen.getByLabelText(/password/i); // Selecting the password input field
        const loginButton = screen.getByRole("button", { name: /login/i }); // Selecting the login button

        fireEvent.change(usernameInput, { target: { value: "testuser" } }); // Simulating user input for the username field
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } }); // Simulating user input for the password field
        fireEvent.click(loginButton); // Simulating a click on the login button

        const errorMessage = await screen.findByText(/login failed/i); // Verifying that the error message is displayed
        expect(errorMessage).toBeTruthy(); // Ensuring the error message is present in the DOM
        expect(mockLogin).toHaveBeenCalledWith("testuser", "wrongpassword"); // Verifying that the login function was called with the correct arguments
    });

    it("should navigate to the dashboard on successful login", async () => {
        mockLogin.mockResolvedValueOnce(true); // Simulating a successful login attempt

        renderWithRouter(<LoginPage />); // Rendering the LoginPage component for testing

        const usernameInput = screen.getByLabelText(/username/i); // Selecting the username input field
        const passwordInput = screen.getByLabelText(/password/i); // Selecting the password input field
        const loginButton = screen.getByRole("button", { name: /login/i }); // Selecting the login button

        fireEvent.change(usernameInput, { target: { value: "testuser" } }); // Simulating user input for the username field
        fireEvent.change(passwordInput, {
            // Simulating user input for the password field
            target: { value: "correctpassword" },
        });
        fireEvent.click(loginButton); // Simulating a click on the login button

        await screen.findByRole("button", { name: /login/i }); // Waiting for the button to re-enable after the login attempt
        expect(mockLogin).toHaveBeenCalledWith("testuser", "correctpassword"); // Verifying that the login function was called with the correct arguments
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard"); // Verifying that the user was navigated to the dashboard
    });

    it("should not call login if fields are empty", () => {
        renderWithRouter(<LoginPage />);

        const loginButton = screen.getByRole("button", { name: /login/i }); // Selecting the login button
        fireEvent.click(loginButton); // Simulating a click on the login button without filling the fields

        expect(mockLogin).not.toHaveBeenCalled(); // Ensuring the login function was not called
    });
});
