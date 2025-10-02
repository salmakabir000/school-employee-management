import { useState } from "react";
import { Box, Toolbar } from "@mui/material";

import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Optional Topbar */}
      <Topbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "64px", // adjust if no Topbar
        }}
      >
        <Toolbar /> {/* optional if you want spacing */}
        {children}
      </Box>
    </Box>
  );
}
