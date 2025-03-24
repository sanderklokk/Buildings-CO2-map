import { Container, Typography, Button, Stack } from "@mui/material";

export const Admin = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Administrasjonspanel
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained">Administrer materialer</Button>
        <Button variant="outlined">Vis avfallsrapporter</Button>
      </Stack>
    </Container>
  );
};
export default Admin;
