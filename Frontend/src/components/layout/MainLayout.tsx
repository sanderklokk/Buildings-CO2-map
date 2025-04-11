import { ReactNode } from "react";
import { Box } from "@mui/material";
import UserMenu from "./UserMenu";
import trkLogoWithText from "../../assets/trk/trklogo_withtext.svg";

interface MainLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const MainLayout = ({ sidebar, children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        className="bg-gray-100"
        component="aside"
        sx={{ width: "25%", p: 2 }}
      >
        <Box
          component="img"
          src={trkLogoWithText}
          alt="TRK Logo"
          sx={{ width: "80%", mb: 2 }}
        />
        {sidebar}
      </Box>
      <Box sx={{ width: "75%", display: "flex", flexDirection: "column" }}>
        <Box
          component="header"
          sx={{
            height: "12.5vh",
            bgcolor: "white",
            boxShadow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            px: 2,
          }}
        >
          <UserMenu />
        </Box>
        <Box component="main" sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
