// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // your brand blue
    },
    secondary: {
      main: "#ff4081", // your brand pink
    },
    background: {
      default: "#f9f9f9",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // removes ALL CAPS on buttons
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "1rem",
        },
      },
    },
  },
});

export default theme;
