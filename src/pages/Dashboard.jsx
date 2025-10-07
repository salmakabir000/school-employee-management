import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getLeaves } from "../services/leaveService";
import { getEmployees } from "../services/employeeService";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import TodayIcon from "@mui/icons-material/Today";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const leaveData = await getLeaves();
        setLeaves(leaveData);

        if (user.role === "Admin" || user.role === "Manager") {
          const empData = await getEmployees();
          setEmployees(empData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [user.role]);

  // Counts
  const pendingCount = leaves.filter(l => l.status === "Pending").length;
  const approvedCount = leaves.filter(l => l.status === "Approved").length;
  const rejectedCount = leaves.filter(l => l.status === "Rejected").length;
  const leavesToday = leaves.filter(
    l =>
      l.status === "Approved" &&
      new Date(l.startDate).toDateString() === new Date().toDateString()
  ).length;

  return (
    <Box p={4}>
      {/* Header with Logout */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Good Day, {user.name || user.username || "User"}!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Typography>
          <Typography variant="body2" mt={1} color="textSecondary">
            {user.role === 'Employee' 
              ? 'Check your leave status below.' 
              : 'Review team leave requests today.'}
          </Typography>
        </Box>
        <Button variant="contained" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {user.role === "Employee" ? (
          <>
            <StatCard title="Pending Leaves" value={pendingCount} icon={<HourglassEmptyIcon />} color="warning.main" />
            <StatCard title="Approved Leaves" value={approvedCount} icon={<CheckCircleIcon />} color="success.main" />
            <StatCard title="Rejected Leaves" value={rejectedCount} icon={<CancelIcon />} color="error.main" />
          </>
        ) : (
          <>
            <StatCard title="Total Employees" value={employees.length} icon={<PeopleAltIcon />} color="primary.main" />
            <StatCard title="On Leave Today" value={leavesToday} icon={<TodayIcon />} color="info.main" />
            <StatCard title="Pending Requests" value={pendingCount} icon={<AssignmentIcon />} color="warning.main" />
          </>
        )}
      </Grid>

      {/* Upcoming Tasks / Events */}
      <Card sx={{ p: 2, mt: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" mb={2}>
          Upcoming Tasks & Events
        </Typography>
        <Stack spacing={1}>
          {user.role !== 'Employee' && <Typography>📌 Pending leave approvals: {pendingCount}</Typography>}
          <Typography>📅 Staff meeting – Oct 25</Typography>
          <Typography>⚠️ System maintenance – Oct 28</Typography>
          <Typography>📌 Submit monthly reports – Oct 30</Typography>
        </Stack>
      </Card>

      {/* Quick Actions */}
      <Box mt={4} display="flex" gap={2} flexWrap="wrap">
        {user.role === 'Employee' && (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CalendarMonthIcon />}
              onClick={() => navigate("/leaves")}
            >
              Request Leave
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PersonIcon />}
              onClick={() => navigate("/Profile")}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<GroupIcon />}
              onClick={() => navigate("/employees")}
            >
              View Employees
            </Button>
          </>
        )}

        {user.role === 'Manager' && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate("/leaves")}
            >
              Approve Requests
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<GroupIcon />}
              onClick={() => navigate("/employees")}
            >
              View Employees
            </Button>
          </>
        )}

        {user.role === 'Admin' && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate("/leaves")}
            >
              Approve Requests
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FolderSharedIcon />}
              onClick={() => navigate("/employees")}
            >
              Add Employee
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
          <Box>
            <Typography color="textSecondary" variant="body2">{title}</Typography>
            <Typography variant="h5" fontWeight="bold">{value}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
