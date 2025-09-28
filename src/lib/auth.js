// lib/auth.js

let user = null;
let listeners = [];

// Load user from localStorage if available
if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("invoice_user");
  if (savedUser) {
    user = JSON.parse(savedUser);
  }
}

export async function login(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (email === "demo@invoice.com" && password === "demo123") {
    user = {
      id: "1",
      email: "demo@invoice.com",
      name: "Demo User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    };

    localStorage.setItem("invoice_user", JSON.stringify(user));
    notifyListeners();
    return user;
  }

  throw new Error("Invalid credentials");
}

export async function signup(email, password, name) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  user = {
    id: Date.now().toString(),
    email,
    name,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  };

  localStorage.setItem("invoice_user", JSON.stringify(user));
  notifyListeners();
  return user;
}

export async function logout() {
  user = null;
  localStorage.removeItem("invoice_user");
  notifyListeners();
}

export function getCurrentUser() {
  return user;
}

export function onAuthStateChanged(callback) {
  listeners.push(callback);
  callback(user); // immediately call with current state

  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener(user));
}
