import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    trklightgray: Palette["primary"];
    trkwhite: Palette["primary"];
    trkblack: Palette["primary"];
  }
  interface PaletteOptions {
    trklightgray?: PaletteOptions["primary"];
    trkwhite?: PaletteOptions["primary"];
    trkblack?: PaletteOptions["primary"];
  }
}
