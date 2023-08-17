import { lazy } from "react";

// project imports
import Loadable from "ui-component/Loadable";
import MinimalLayout from "layout/MinimalLayout";
import Dashboard from "views/dashboard/Default";
import MainLayout from "layout/MainLayout";

// login option 3 routing
const Login = Loadable(lazy(() => import("views/Authentication/login")));

const token = localStorage.getItem("token");

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: token ? <MainLayout /> : <MinimalLayout />,
  children: [
    {
      path: "/",
      element: token ? <Dashboard /> : <Login />,
    },
  ],
};

export default AuthenticationRoutes;
