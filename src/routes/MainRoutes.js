import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";

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

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "staff",
      children: [
        {
          path: "",
          element: <Staff />,
        },
      ],
    },
    {
      path: "transaction",
      children: [
        {
          path: "",
          element: <Transaction />,
        },
      ],
    },
    {
      path: "leaves",
      children: [
        {
          path: "",
          element: <Leaves />,
        },
      ],
    },
    {
      path: "salary",
      children: [
        {
          path: "",
          element: <Salary />,
        },
      ],
    },
  ],
};

export default MainRoutes;
