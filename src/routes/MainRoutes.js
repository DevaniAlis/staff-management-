import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate, Route, Routes } from "react-router";

// Check if the token exists in localStorage
const isTokenAvailable = localStorage.getItem("token");

// Protected route component to handle access based on token
const ProtectedRoute = ({ element: Element, ...rest }) => {
  return isTokenAvailable ? (
    <Routes>
      <Route {...rest} element={<Element />} />
    </Routes>
  ) : (
    <Navigate to="/" />
  );
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
      element: <ProtectedRoute path="" element={DashboardDefault} />,
    },
    {
      path: "/staff",
      element: <ProtectedRoute path="" element={Staff} />,
    },
    {
      path: "transaction",
      element: <ProtectedRoute path="" element={Transaction} />,
    },
    {
      path: "leaves",
      element: <ProtectedRoute path="" element={Leaves} />,
    },
    {
      path: "salary",
      element: <ProtectedRoute path="" element={Salary} />,
    },
    {
      path: "report",
      element: <ProtectedRoute path="" element={Report} />,
    },
  ],
};

export default MainRoutes;
