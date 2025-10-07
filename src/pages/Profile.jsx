// Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import WorkIcon from "@mui/icons-material/Work";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SchoolIcon from "@mui/icons-material/School";
import PhoneIcon from "@mui/icons-material/Phone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const res = await fetch("https://school-employee-management.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const roleColors = {
    Admin: "red",
    Manager: "blue",
    Employee: "green",
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "2rem auto", padding: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: roleColors[profile.role] || "grey" }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h5">{profile.name || "N/A"}</Typography>
        </Box>

        <Grid container spacing={1}>
          {profile.employeeId && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BadgeIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Employee ID: {profile.employeeId}</Typography>
              </Box>
            </Grid>
          )}

          {profile.role && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WorkIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ color: roleColors[profile.role] || "black" }}>
                  Role: {profile.role}
                </Typography>
              </Box>
            </Grid>
          )}

          {profile.departmentCategory && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ApartmentIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Department: {profile.departmentCategory}</Typography>
              </Box>
            </Grid>
          )}

          {profile.schoolDepartment && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SchoolIcon sx={{ mr: 1 }} />
                <Typography variant="body1">School Department: {profile.schoolDepartment}</Typography>
              </Box>
            </Grid>
          )}

          {profile.position && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WorkIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Position: {profile.position}</Typography>
              </Box>
            </Grid>
          )}

          {profile.contact && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Contact: {profile.contact}</Typography>
              </Box>
            </Grid>
          )}

          {profile.startDate && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Start Date: {new Date(profile.startDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>    
      {/* Quick Links */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>
        </Box>
      
    </Card>
  );
}
