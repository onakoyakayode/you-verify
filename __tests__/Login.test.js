import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/login/page";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

jest.mock("@/lib/auth", () => ({
  login: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login Component", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls login and redirects on successful submit", async () => {
    login.mockResolvedValueOnce(true); // mock successful login

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "demo@invoice.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "demo123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith("demo@invoice.com", "demo123")
    );
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("displays error message on failed login", async () => {
    login.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});
