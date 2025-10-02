import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Grid,
  Paper,
} from "@mui/material";

export default function EmployeeForm({ form, setForm, editingId, setEditingId, onSubmit, departmentData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentCategory" && value !== "Academics") {
      setForm({ ...form, [name]: value, schoolDepartment: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        backgroundColor: "background.default",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        {editingId ? "Edit Employee" : "Add New Employee"}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Department Category</InputLabel>
            <Select
              name="departmentCategory"
              value={form.departmentCategory}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>-- Select Category --</em>
              </MenuItem>
              {Object.keys(departmentData).map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {form.departmentCategory === "Academics" && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>School Department</InputLabel>
              <Select
                name="schoolDepartment"
                value={form.schoolDepartment}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>-- Select School Department --</em>
                </MenuItem>
                {departmentData.Academics.schoolDepartments.map(dep => (
                  <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth disabled={!form.departmentCategory}>
            <InputLabel>Position</InputLabel>
            <Select
              name="position"
              value={form.position}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>-- Select Position --</em>
              </MenuItem>
              {form.departmentCategory &&
                departmentData[form.departmentCategory].positions.map(pos => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          {editingId ? "Update Employee" : "Add Employee"}
        </Button>
        {editingId && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setForm({
              name: "",
              departmentCategory: "",
              schoolDepartment: "",
              position: "",
              contact: "",
              startDate: "",
            })}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Paper>
  );
}
