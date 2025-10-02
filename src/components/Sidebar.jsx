import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";


export default function Sidebar({
  drawerWidth,
  collapsedWidth,
  mobileOpen,
  collapsed,
  handleDrawerToggle,
  handleCollapseToggle,
}) {
  const [hovered, setHovered] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/" },
    { text: "Employees", icon: <PeopleIcon />, path: "/employees" },
    { text: "Leaves", icon: <CalendarMonthIcon />, path: "/leaves" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: collapsed && !hovered ? "center" : "space-between",
          alignItems: "center",
          px: 1,
        }}
      >
        {!collapsed || hovered ? <h3>School</h3> : null}

        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <IconButton onClick={handleCollapseToggle}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {(!collapsed || hovered) && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: collapsed && !hovered ? collapsedWidth : drawerWidth,
            transition: "width 0.3s ease",
            boxSizing: "border-box",
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
