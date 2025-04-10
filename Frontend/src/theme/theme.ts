import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#005aa7", // trk deep blue
    },
    secondary: {
      main: "#009bdf", // trk light blue
    },
    background: {
      default: "#ffffff", // trk white
    },

    trklightgray: {
      main: "#cccccc",
      contrastText: "#ffffff",
    },

    trkblack: {
      main: "#ffffff",
      contrastText: "#000000",
    },

    trkwhite: {
      main: "#000000",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
