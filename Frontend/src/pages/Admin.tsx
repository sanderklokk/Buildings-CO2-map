import { Container, Typography, Button, Stack, Box } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssessmentIcon from "@mui/icons-material/Assessment";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <MainLayout sidebar={<Box />}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Admin Panel
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              flex: 1,
              fontSize: "1.25rem",
              padding: "16px 32px",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <MapIcon sx={{ fontSize: "2.5rem" }} />
            Kartsøk
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/materialmanagement")}
            sx={{
              flex: 1,
              fontSize: "1.25rem",
              padding: "16px 32px",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Inventory2Icon sx={{ fontSize: "2.5rem" }} />
            Administrer materialer
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/ViewReports")}
            sx={{
              flex: 1,
              fontSize: "1.25rem",
              padding: "16px 32px",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <AssessmentIcon sx={{ fontSize: "2.5rem" }} />
            Vis innsendte avfallsrapporter
          </Button>
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default Admin;
