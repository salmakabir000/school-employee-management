import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from "@mui/material";

export default function EmployeeTable({ employees, user, onEdit, onDelete, onPromote, departmentData }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "primary.light" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>School Department</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
            {user?.role === "Admin" && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.map(emp => (
            <TableRow key={emp.id} sx={{
              "&:hover": { backgroundColor: "action.hover" },
            }}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.employeeId || "-"}</TableCell>
              <TableCell>{emp.departmentCategory}</TableCell>
              <TableCell>{emp.schoolDepartment || "-"}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>{emp.contact}</TableCell>
              <TableCell>{new Date(emp.startDate).toLocaleDateString()}</TableCell>

              {user?.role === "Admin" && (
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => onEdit(emp)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => onDelete(emp.id)}
                  >
                    Delete
                  </Button>

                  <Select
                    defaultValue=""
                    size="small"
                    displayEmpty
                    onChange={(e) => e.target.value && onPromote(emp, e.target.value)}
                  >
                    <MenuItem value="">Promote to...</MenuItem>
                    {departmentData[emp.departmentCategory]?.positions
                      .filter(p => p !== emp.position)
                      .map(p => (
                        <MenuItem key={p} value={p}>{p}</MenuItem>
                      ))}
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
