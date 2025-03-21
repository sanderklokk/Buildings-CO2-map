import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { SubmitReportPage } from "./SubmitReportPage";
import { Admin } from "./Admin";
import MaterialManagement from "./MaterialManagement";

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
    {
      name: "SubmitReportPage",
      path: "/report/create",
      component: <SubmitReportPage />,
    },

    {
      name: "Adminpanel",
      path: "/adminpanel",
      component: <Admin />,
    },

    {
      name: "MaterialManagement",
      path: "/materialmanagement",
      component: <MaterialManagement />,
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
