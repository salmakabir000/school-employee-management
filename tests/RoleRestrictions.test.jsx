import { render, screen } from "@testing-library/react";
import EmployeesPage from "../Employees/EmployeesPage";
import React from "react";

describe("Role restrictions", () => {
  test("Admin sees Add Employee button", () => {
    localStorage.setItem("role", "Admin");
    render(<EmployeesPage />);
    expect(screen.getByRole("button", { name: /add employee/i })).toBeInTheDocument();
  });

  test("Employee does NOT see Add Employee button", () => {
    localStorage.setItem("role", "Employee");
    render(<EmployeesPage />);
    expect(screen.queryByRole("button", { name: /add employee/i })).not.toBeInTheDocument();
  });
});
