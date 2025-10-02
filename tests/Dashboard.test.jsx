// __tests__/Dashboard.test.jsx
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "../Dashboard";
import React from "react";

test("redirects to login if not authenticated", () => {
  render(
    <AuthProvider value={{ user: null }}>
      <Dashboard />
    </AuthProvider>
  );
  expect(screen.getByText(/please login/i)).toBeInTheDocument();
});

test("shows dashboard if authenticated", () => {
  render(
    <AuthProvider value={{ user: { name: "Salma", role: "Admin" } }}>
      <Dashboard />
    </AuthProvider>
  );
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
