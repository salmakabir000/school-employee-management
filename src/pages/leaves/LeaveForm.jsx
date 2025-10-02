import { useState } from "react";
import { TextField, Button, Box, MenuItem, Typography, Paper, Alert } from "@mui/material";

export default function LeaveForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(form); // call parent to save
      setForm({ leaveType: "", startDate: "", endDate: "", reason: "" }); // reset
      setSuccess(true);

      // hide success message & optionally close form after a bit
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mt: 2 }}>
      <Typography variant="h6" mb={2}>
        Request Leave
      </Typography>

      {success && <Alert severity="success">✅ Leave request submitted!</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          select
          label="Leave Type"
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="Sick">Sick</MenuItem>
          <MenuItem value="Casual">Casual</MenuItem>
          <MenuItem value="Annual">Annual</MenuItem>
        </TextField>

        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
