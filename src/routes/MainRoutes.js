import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate, Route, Routes } from "react-router";

// Check if the token exists in localStorage
const isTokenAvailable = localStorage.getItem("token");

// Protected route component to handle access based on token
const ProtectedRoute = ({ children }) => {
  return !isTokenAvailable ? <Navigate to="/" /> : children
};

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

const Staff = Loadable(lazy(() => import("../views/staff/staff")));
const Transaction = Loadable(
  lazy(() => import("views/transaction/transaction"))
);
const Salary = Loadable(lazy(() => import("views/otherFiles/salary")));
const Leaves = Loadable(lazy(() => import("views/otherFiles/leaves")));
const Report = Loadable(lazy(() => import("views/report/report")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/dashboard",
      element: <ProtectedRoute> <DashboardDefault/> </ProtectedRoute>,
    },
    {
      path: "/staff",
      element: <ProtectedRoute> <Staff/></ProtectedRoute>,
    },
    {
      path: "/transaction",
      element: <ProtectedRoute><Transaction/></ProtectedRoute>,
    },
    {
      path: "/leaves",
      element: <ProtectedRoute><Leaves/></ProtectedRoute>,
    },
    {
      path: "/salary",
      element: <ProtectedRoute><Salary/></ProtectedRoute>,
    },
    {
      path: "/report",
      element: <ProtectedRoute><Report/></ProtectedRoute>,
    },
  ],
};

export default MainRoutes;
