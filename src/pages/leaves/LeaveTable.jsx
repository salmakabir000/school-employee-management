import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Stack,
} from "@mui/material";

export default function LeaveTable({ leaves, user, onDelete, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Employee</TableCell>
          <TableCell>Start</TableCell>
          <TableCell>End</TableCell>
          <TableCell>Reason</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leaves.map((leave) => (
          <TableRow key={leave._id}>
            <TableCell>{leave.employee?.username || leave.employee}</TableCell>
            <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
            <TableCell>{leave.reason}</TableCell>
            <TableCell>
              <Chip label={leave.status} color={getStatusColor(leave.status)} />
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                {user.role === "Employee" &&
                  String(leave.employee?._id || leave.employee) === String(user.id) &&
                  leave.status === "Pending" && (
                    <Button onClick={() => onDelete(leave._id)} color="error" size="small">
                      Delete
                    </Button>
                  )}

                {(user.role === "Manager" || user.role === "Admin") &&
                  leave.status === "Pending" && (
                    <>
                      <Button
                        onClick={() => onUpdateStatus(leave._id, "Approved")}
                        color="success"
                        size="small"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => onUpdateStatus(leave._id, "Rejected")}
                        color="error"
                        size="small"
                      >
                        Reject
                      </Button>
                    </>
                  )}
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
