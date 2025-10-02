import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeesPage from "../Employees/EmployeesPage";
import React from "react";

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("EmployeesPage CRUD", () => {
  test("reads and displays employees list", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: "1", name: "John Doe", employeeId: "EMP001" },
        { _id: "2", name: "Jane Doe", employeeId: "EMP002" },
      ],
    });

    render(<EmployeesPage />);
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  test("creates a new employee", async () => {
    // Mock list fetch
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "3", name: "New Guy", employeeId: "EMP003" }),
      });

    render(<EmployeesPage />);
    const addButton = await screen.findByRole("button", { name: /add employee/i });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "New Guy" } });
    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: "EMP003" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("New Guy")).toBeInTheDocument();
    });
  });

  test("updates an employee", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ _id: "1", name: "John Doe", employeeId: "EMP001" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "1", name: "John Updated", employeeId: "EMP001" }),
      });

    render(<EmployeesPage />);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Updated" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("John Updated")).toBeInTheDocument();
    });
  });

  test("deletes an employee", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ _id: "1", name: "John Doe", employeeId: "EMP001" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    render(<EmployeesPage />);
    const deleteButton = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });
});
