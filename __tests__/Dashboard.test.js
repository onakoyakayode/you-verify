import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/auth", () => ({
  onAuthStateChanged: jest.fn((callback) => {
    // Only call once, simulate logged in user
    callback({ name: "Test User", avata: "/avatar.png" });
    return jest.fn(); // unsubscribe
  }),
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock("@/lib/invoices", () => ({
  getInvoices: jest.fn().mockResolvedValue([
    {
      id: "1",
      number: "INV001",
      dueDate: new Date(),
      amount: 1000,
      status: "paid",
    },
    {
      id: "2",
      number: "INV002",
      dueDate: new Date(),
      amount: 2000,
      status: "sent",
    },
  ]),
  getInvoiceStats: jest.fn().mockResolvedValue({
    total: { amount: 3000 },
    overdue: { count: 1, amount: 1000 },
    pending: { amount: 500 },
  }),
}));

jest.mock("@/lib/websocket", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  onActivity: jest.fn((cb) => () => {}),
}));

describe("Dashboard Page", () => {
  it("renders dashboard with user, invoices, and stats", async () => {
    render(<Dashboard />);

    // Wait for user name
    const userName = await screen.findByText(/Test User/i);
    expect(userName).toBeInTheDocument();

    // Wait for invoices
    expect(await screen.findByText(/INV001/i)).toBeInTheDocument();
    expect(await screen.findByText(/INV002/i)).toBeInTheDocument();

    // Wait for stats
    expect(await screen.findByText(/\$3,000/i)).toBeInTheDocument();
    expect(await screen.findByText(/\$1,000/i)).toBeInTheDocument();
  });
});
