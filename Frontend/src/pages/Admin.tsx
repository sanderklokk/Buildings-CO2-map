import { Container, Typography, Button, Stack, Box } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <MainLayout sidebar={<Box />}>
      <Container>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Kartsøk
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/materialmanagement")}
          >
            Administrer materialer
          </Button>
          <Button variant="contained" onClick={() => navigate("/ViewReports")}>
            Vis innsendte avfallsrapporter
          </Button>
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default Admin;
