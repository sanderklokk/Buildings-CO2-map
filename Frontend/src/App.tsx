import { Router } from "./pages/Router";
import "./App.css";
import { AppProvider, Session } from "@toolpad/core/AppProvider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

const demoSession: Session = {
  user: {
    name: "Ola Nordmann",
    email: "ola@trondheimkommune.no",
  },
};

const authentication = {
  signIn: () => {
    console.log("SignIn");
  },
  signOut: () => {
    console.log("SignOut");
  },
};

function App() {
  return (
    <AppProvider authentication={authentication} session={demoSession}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
