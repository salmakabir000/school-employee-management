// src/services/employeeService.jsx
import { getToken, logout } from "./authService";

const API_URL = "https://school-employee-management.onrender.com/employees";

// Generate Employee ID
function generateEmployeeId(departmentCategory, schoolDepartment) {
  let base = departmentCategory || "GEN";
  if (departmentCategory === "Academics" && schoolDepartment) {
    base = schoolDepartment;
  }

  const initials = base
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");

  const schoolCode = "S";
  const rand = Math.floor(100 + Math.random() * 900);

  return `${initials}${schoolCode}${rand}`;
}



//  Fetch with auth, role check & improved error handling
async function fetchWithAuth(url, options = {}, allowedRoles = []) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please login.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  console.log("Fetching:", url, "with headers:", headers);

  const res = await fetch(url, { ...options, headers });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: res.statusText };
  }

  if (!res.ok) {
    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized: Invalid token or session expired.");
    }
    if (res.status === 403) {
      const msg = allowedRoles.length
        ? `Forbidden: Insufficient rights. Requires one of: ${allowedRoles.join(", ")}`
        : "Forbidden: Insufficient rights.";
      throw new Error(msg);
    }
    throw new Error(`Error ${res.status}: ${data.message || res.statusText}`);
  }

  // Frontend role validation
  if (allowedRoles.length && data.userRole) {
    const role = data.userRole.toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(role)) {
      throw new Error(`Forbidden: Your role (${data.userRole}) is not allowed.`);
    }
  }

  return data;
}

//CRUD Operations
export async function getEmployees() {
  // Everyone can fetch employees → no allowedRoles passed
  return fetchWithAuth(API_URL); 
}

//Admin-only action
export async function addEmployee(employee) {
  const employeeWithId = {
    ...employee,
    employeeId: generateEmployeeId(employee.departmentCategory, employee.schoolDepartment),
  };
  return fetchWithAuth(API_URL, {
    method: "POST",
    body: JSON.stringify(employeeWithId),
  }, ["Admin"]); // only Admin can add
}

export async function updateEmployee(id, updatedData) {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  }, ["Admin"]);
}

export async function deleteEmployee(id) {
  await fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" }, ["Admin"]);
  return true;
}
