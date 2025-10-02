import { getToken } from "./authService";

const API_URL = "https://school-employee-management.onrender.com/leave";

// Helper: include token in headers
function getAuthHeaders() {
  const token = getToken();
  if (!token) throw new Error("No token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Get all leaves
export async function getLeaves() {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const user = JSON.parse(localStorage.getItem("user"));
  const url = user.role === "Employee" ? `${API_URL}/my` : API_URL;

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch leaves: ${res.status} ${text}`);
  }

  return res.json();
}

// Add new leave request (Employee only)
export async function addLeave(leave) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...leave, status: "Pending" }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to add leave: ${res.status} ${text}`);
  }

  return res.json();
}

// 🔹 Update leave status (Manager/Admin only)
export async function updateLeave(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update leave: ${res.status} ${text}`);
  }

  return res.json();
}

// 🔹 Delete leave (Employee only)
export async function deleteLeave(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete leave: ${res.status} ${text}`);
  }

  return { message: "Leave deleted successfully" };
}
