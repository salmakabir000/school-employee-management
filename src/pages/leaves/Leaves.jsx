import { useState, useEffect } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import LeaveForm from "./LeaveForm";
import LeaveTable from "./LeaveTable";
import { useAuth } from "../../context/AuthContext";
import RoleGate from "../../components/RoleGate";
import { getLeaves, addLeave, updateLeave, deleteLeave } from "../../services/leaveService";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

export default function Leaves() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (token) {
      getLeaves(token)
        .then(setLeaves)
        .catch((err) => console.error("Failed to fetch leaves:", err));
    }
  }, [token]);

  const handleAddLeave = async (leaveData) => {
    try {
      const newLeave = await addLeave({ ...leaveData }, token);
      console.log("API returned leave:", newLeave); // 👀 log it

      setLeaves((prevLeaves) => [...prevLeaves, newLeave]);
      console.log("Updated leaves state:", leaves); // 👀 see if it updates

      setOpenForm(false);
    } catch (err) {
      console.error("Failed to add leave:", err);
    }
  };



  const handleDelete = async (id) => {
    await deleteLeave(id, token);
    setLeaves(leaves.filter((leave) => leave._id !== id));
  };

  const handleUpdateStatus = async (id, status) => {
    const updated = await updateLeave(id, { status }, token);
    setLeaves(leaves.map((l) => (l._id === id ? updated.leave || updated : l)));
  };

  // Safely filter leaves for employee or show all for manager/admin
  const visibleLeaves = user
    ? user.role === "Employee"
      ? leaves.filter((l) => String(l.employee?._id || l.employee) === String(user.id))
      : leaves
    : [];

  return (
    <Box p={4}>
      {/* Quick Links */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
        <Button
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>

        <RoleGate role="Employee">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Request Leave
          </Button>
        </RoleGate>

        <RoleGate role="Admin">
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate ("/employees")}
          >
            Add Employee
          </Button>
        </RoleGate>
      </Box>

      <Typography variant="h4" gutterBottom>
        Leave Requests
      </Typography>

      {/* Employee Leave Form Modal */}
      {openForm && (
        <LeaveForm onClose={() => setOpenForm(false)} onSubmit={handleAddLeave} />
      )}

      <Paper sx={{ mt: 2, p: 2, borderRadius: 3, boxShadow: 3 }}>
        <LeaveTable
          leaves={visibleLeaves}
          user={user}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      </Paper>
    </Box>
  );
}
