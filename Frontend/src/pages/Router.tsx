import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";

export const Router = () => {

    const routes = [
        {
            name: 'Home',
            path: '/',
            component: <Home/>
        }
    ]

    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => (
                    <Route key={route.name} path={route.path} element={route.component} />
                ))}
            </Routes>
        </BrowserRouter>
    )
}