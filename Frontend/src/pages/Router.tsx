import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";

export const Router = () => {
  const routes = [
    {
      name: "Home",
      path: "/",
      component: <Home />,
    },
    {
      name: "Login",
      path: "/login",
      component: <Login />,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.name} path={route.path} element={route.component} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
