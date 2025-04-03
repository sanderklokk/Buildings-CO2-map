import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      setError("Ugyldig brukernavn eller passord");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ padding: 20 }}>
      <Paper sx={{ padding: 5 }}>
        <img
          src="/images/trkLogoHorisontalFarge.png"
          alt="TRK Logo"
          className="mb-4 w-4/5"
        />
        <Typography variant="h4" gutterBottom align="center">
          Logg inn
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Brukernavn"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Passord"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button variant="contained" onClick={handleLogin} fullWidth>
            Logg inn
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
