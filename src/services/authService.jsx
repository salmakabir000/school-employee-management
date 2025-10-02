// src/services/authService.js
const API_URL = "http://localhost:4000";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Login failed" }));
    return { success: false, message: error.message };
  }

  const data = await res.json();
  console.log("Login response:", data);
  


  // Save both token and user in localStorage (so it survives refresh)
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return { success: true, ...data };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function getToken() {
  return localStorage.getItem("token");
}
