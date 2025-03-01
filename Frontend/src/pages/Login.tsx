import {
  Button,
  TextField,
  Container,
  Link,
  Paper,
  Typography,
} from "@mui/material";

export const Login = () => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      className="flex items-center justify-center min-h-screen"
    >
      <Paper elevation={3} className="p-6 rounded-2xl shadow-lg w-full">
        <div className="flex flex-col items-center">
          <img
            src="/images/trkLogoHorisontalFarge.png"
            alt="TRK Logo"
            className="mb-4 w-4/5"
          />

          <Typography
            component="h1"
            variant="h5"
            className="text-(--color-trk-black)"
          >
            Logg inn
          </Typography>
          <form className="w-full mt-4">
            <TextField
              margin="normal"
              required
              fullWidth
              label="E-post"
              type="email"
              className="mb-3"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Passord"
              type="password"
              className="mb-3"
            />
            <Button fullWidth variant="contained">
              Logg inn
            </Button>
            <div className="flex justify-between mt-4 text-sm">
              <Link href="#" className="hover:underline">
                Glemt passord?
              </Link>
            </div>
          </form>
        </div>
      </Paper>
    </Container>
  );
};
