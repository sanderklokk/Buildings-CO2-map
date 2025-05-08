import { describe, it, expect } from "vitest";
import UserMenu from "../../../components/layout/UserMenu";
import {
  fireEvent,
  render as normal_render,
  screen,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const useremail = "ola@trondheimkommune.no";
const name = "Ola Nordmann";

const render = (element: React.ReactElement) => {
  return normal_render(<BrowserRouter>{element}</BrowserRouter>);
};

describe("Navbar", () => {
  it("check render", () => {
    render(<UserMenu />);

    expect(screen.getByAltText(name)).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(useremail)).toBeInTheDocument();
  });

  it("check show menu", () => {
    render(<UserMenu />);
    const userMenu = screen.getByTestId("usermenu-btn");
    fireEvent.click(userMenu);
    expect(screen.getByText("Administrasjonspanel")).toBeInTheDocument();
    expect(screen.getByText("Kartsøk")).toBeInTheDocument();
    expect(
      screen.getByText("Se innsendte avfallsrapporter"),
    ).toBeInTheDocument();
    expect(screen.getByText("Rediger materialer")).toBeInTheDocument();
    expect(screen.getByText("Logg ut")).toBeInTheDocument();
  });
});
