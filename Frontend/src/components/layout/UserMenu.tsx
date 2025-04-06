import React, { useState } from "react";
import { Avatar, Box, Menu, MenuItem, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import ReportIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import { useNavigate } from "react-router-dom";
import profilePic from "../../../Images/trkLogoUtenTekst.png";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    handleClose();
    window.location.replace("/login");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          p: 1,
          "&:hover": { backgroundColor: "grey.100" },
        }}
      >
        <Avatar
          src={profilePic}
          alt="Ola Nordmann"
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
          <Typography variant="subtitle1">Ola Nordmann</Typography>
          <Typography variant="caption" color="text.secondary">
            ola@trondheimkommune.no
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem onClick={() => handleMenuItemClick("/adminpanel")}>
          <DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Administrasjonspanel
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/")}>
          <MapIcon fontSize="small" sx={{ mr: 1 }} /> Kartsøk
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/report/all")}>
          <ReportIcon fontSize="small" sx={{ mr: 1 }} /> Se innsendte
          avfallsrapporter
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/materialmanagement")}>
          <BuildIcon fontSize="small" sx={{ mr: 1 }} /> Rediger materialer
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logg ut
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
