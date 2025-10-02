// __tests__/Profile.test.jsx
import { render, screen } from "@testing-library/react";
import Profile from "../Profile";
import React from "react";

describe("Profile Component", () => {
  test("shows loading spinner initially", () => {
    render(<Profile />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows error when no token", async () => {
    localStorage.removeItem("token");
    render(<Profile />);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no token/i);
  });

  test("renders user profile", async () => {
    localStorage.setItem("token", "fakeToken");

    // mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "Salma",
            role: "Admin",
            employeeId: "EMP001",
          }),
      })
    );

    render(<Profile />);
    expect(await screen.findByText("Salma")).toBeInTheDocument();
    expect(screen.getByText(/Employee ID: EMP001/i)).toBeInTheDocument();
  });
});
