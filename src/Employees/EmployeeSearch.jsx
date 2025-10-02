import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function EmployeeSearch({ search, setSearch }) {
  return (
    <TextField
      label="Search employees..."
      variant="outlined"
      size="small"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        mb: 3,
        width: { xs: "100%", sm: "60%", md: "40%" },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "background.paper",
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
}


