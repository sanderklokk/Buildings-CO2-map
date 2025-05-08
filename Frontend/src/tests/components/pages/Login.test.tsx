import { beforeEach, describe, expect, it } from "vitest";
import {
  fireEvent,
  render as normal_render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../../pages/Login";

const render = (element: React.ReactElement) => {
  return normal_render(<BrowserRouter>{element}</BrowserRouter>);
};

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("check render", async () => {
    render(<Login />);

    expect(screen.getByLabelText("Brukernavn")).toBeInTheDocument();
    expect(screen.getByLabelText("Passord")).toBeInTheDocument();
    expect(screen.getByTestId("login-btn")).toBeInTheDocument();
  });

  it("check login", async () => {
    render(<Login />);
    const usernameinp = screen.getByLabelText("Brukernavn");
    const passwordinp = screen.getByLabelText("Passord");
    const loginbtn = screen.getByTestId("login-btn");

    fireEvent.change(usernameinp, { target: { value: "admin" } });
    fireEvent.change(passwordinp, { target: { value: "admin" } });
    fireEvent.click(loginbtn);

    await waitFor(() => {
      expect(localStorage.getItem("isLoggedIn")).toBe("true");
      expect(window.location.pathname).toBe("/");
    });
  });

  it("check login error", async () => {
    render(<Login />);
    const usernameinp = screen.getByLabelText("Brukernavn");
    const passwordinp = screen.getByLabelText("Passord");
    const loginbtn = screen.getByTestId("login-btn");

    fireEvent.change(usernameinp, { target: { value: "ooo" } });
    fireEvent.change(passwordinp, { target: { value: "ooo" } });
    fireEvent.click(loginbtn);

    await waitFor(() => {
      expect(localStorage.getItem("isLoggedIn")).not.toBe("true");
      expect(
        screen.getByText("Ugyldig brukernavn eller passord"),
      ).toBeInTheDocument();
    });
  });
});
