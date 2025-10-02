import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "../services/employeeService.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "./EmployeeForm.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import EmployeeSearch from "./EmployeeSearch.jsx";
import { toast } from "react-toastify";

// 🔹 Department → Positions mapping
export const departmentData = {
  Academics: {
    schoolDepartments: [
      "Mathematics", "Computer Science", "Physics", "Biology", "Chemistry",
      "English", "Economics", "History",
    ],
    positions: ["Lecturer", "Head of Department", "Teaching Assistant", "Lab Instructor"],
  },
  Administration: {
    positions: ["Registrar", "Admin Officer", "Secretary", "Clerk", "Bursar"],
  },
  HR: { positions: ["HR Manager", "Recruiter", "Payroll Officer"] },
  IT: { positions: ["System Admin", "IT Support", "Network Engineer", "Software Developer"] },
  Security: { positions: ["Chief Security Officer", "Guard", "Surveillance Officer"] },
};

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "", departmentCategory: "", schoolDepartment: "", position: "",
    contact: "", startDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Fetch employees
  useEffect(() => {
    getEmployees()
      .then((data) => {
        const mappedEmployees = data.map(emp => ({ ...emp, id: emp._id }));
        setEmployees(mappedEmployees);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch employees");
        setLoading(false);
      });
  }, []);

  // 🔹 Add or Update Employee
  async function handleSubmit() {
    if (!form.name || !form.departmentCategory || !form.position) {
      toast.error("Please fill in Name, Department, and Position.");
      return;
    }

    try {
      if (editingId) {
        const updated = await updateEmployee(editingId, form);
        setEmployees(employees.map((emp) => (emp.id === editingId ? { ...updated, id: updated._id } : emp)));
        toast.success("Employee updated successfully!");
        setEditingId(null);
      } else {
        const newEmp = await addEmployee(form);
        setEmployees([...employees, { ...newEmp, id: newEmp._id }]);
        toast.success("Employee added successfully!");
      }

      resetForm();
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    }
  }

  // 🔹 Delete
  async function handleDelete(id) {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((emp) => emp.id !== id));
      toast.success("Employee deleted successfully!");
    } catch (err) {
      toast.error("Delete failed!");
      console.error(err);
    }
  }

  // 🔹 Edit
  function handleEdit(emp) {
    setForm({
      name: emp.name,
      departmentCategory: emp.departmentCategory,
      schoolDepartment: emp.schoolDepartment || "",
      position: emp.position,
      contact: emp.contact,
      startDate: emp.startDate,
    });
    setEditingId(emp.id);
  }

  // 🔹 Promote
  async function handlePromote(emp, newPosition) {
    if (!newPosition) return;
    try {
      const updated = await updateEmployee(emp.id, { ...emp, position: newPosition });
      setEmployees(employees.map((e) => (e.id === emp.id ? { ...updated, id: updated._id } : e)));
      toast.success(`${emp.name} promoted to ${newPosition}`);
    } catch (err) {
      toast.error("Promotion failed.");
      console.error(err);
    }
  }

  // 🔹 Filter employees
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.position?.toLowerCase().includes(search.toLowerCase()) ||
      emp.departmentCategory?.toLowerCase().includes(search.toLowerCase()) ||
      emp.schoolDepartment?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Reset form
  function resetForm() {
    setForm({
      name: "",
      departmentCategory: "",
      schoolDepartment: "",
      position: "",
      contact: "",
      startDate: "",
    });
    setEditingId(null);
  }

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/* 🔹 Quick Links */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
        <Button
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Employees
      </Typography>

      <EmployeeSearch search={search} setSearch={setSearch} />

      {user?.role === "Admin" && (
        <EmployeeForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          setEditingId={setEditingId}
          onSubmit={handleSubmit}
          departmentData={departmentData}
        />
      )}

      <EmployeeTable
        employees={filteredEmployees}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPromote={handlePromote}
        departmentData={departmentData}
      />
    </div>
  );
}
