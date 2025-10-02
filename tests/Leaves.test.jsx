import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Leaves from "../pages/leaves/Leaves"; 
import React from "react";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Leave Requests CRUD", () => {
  test("shows leave requests", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: "1", type: "Vacation", status: "Pending" },
        { _id: "2", type: "Sick", status: "Approved" },
      ],
    });

    render(<Leaves />);
    expect(await screen.findByText(/Vacation/i)).toBeInTheDocument();
    expect(screen.getByText(/Sick/i)).toBeInTheDocument();
  });

  test("creates a leave request", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // fetch existing
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "3", type: "Vacation", status: "Pending" }),
      });

    render(<Leaves />);
    fireEvent.click(await screen.findByRole("button", { name: /add leave/i }));

    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "Vacation" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vacation/i)).toBeInTheDocument();
    });
  });

  test("updates a leave request (approve)", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ _id: "1", type: "Vacation", status: "Pending" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "1", type: "Vacation", status: "Approved" }),
      });

    render(<Leaves />);
    const approveBtn = await screen.findByRole("button", { name: /approve/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    });
  });

  test("deletes a leave request", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ _id: "1", type: "Vacation", status: "Pending" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    render(<Leaves />);
    const deleteBtn = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Vacation/i)).not.toBeInTheDocument();
    });
  });
});
