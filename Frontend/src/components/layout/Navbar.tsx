import React, { useState } from "react";
import trkLogoWithText from "../../assets/trk/trklogo_withtext.svg";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="w-full h-[15vh] flex items-center justify-between px-4 bg-white shadow">
      <div>
        <img src={trkLogoWithText} alt="TRK Logo" className="w-80" />
      </div>
      {/* Brukermeny som dropdown til høyre */}
      <div>
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar alt="User Avatar" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
        >
          <MenuItem onClick={handleClose}>Se avfallsrapporter</MenuItem>
          <MenuItem onClick={handleClose}>Rediger materialer</MenuItem>
          <MenuItem onClick={handleClose}>Logg ut</MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
