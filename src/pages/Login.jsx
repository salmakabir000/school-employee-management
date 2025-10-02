import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous error
    const res = await loginService(username, password);

    if (res.success) {
      login(res.user, res.token);
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <SchoolIcon sx={{ fontSize: 60, color: "#4A90E2" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              School EMS — Login
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome! Please sign in to continue
            </Typography>
          </Box>

          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              Sign In
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
