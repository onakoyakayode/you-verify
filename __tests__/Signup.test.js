import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "@/app/signup/page";

describe("Signup Component", () => {
  it("renders signup form fields", () => {
    render(<Signup />);
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("updates form fields on user input", () => {
    render(<Signup />);

    const nameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123" },
    });

    expect(nameInput.value).toBe("Test User");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("Password123");
    expect(confirmPasswordInput.value).toBe("Password123");
  });

  it("shows error if passwords do not match", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Mismatch123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // await the alert to appear
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Passwords do not match");
  });

  it("submits the form if passwords match", () => {
    console.log = jest.fn();

    render(<Signup />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(console.log).toHaveBeenCalledWith("Form submitted", {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });

    expect(screen.queryByRole("alert")).toBeNull(); // no error shown
  });
});
