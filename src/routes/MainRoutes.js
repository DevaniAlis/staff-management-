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

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("views/sample-page")));

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
    // {
    //   path: "other",
    //   children: [
    //     {
    //       path: "salary",
    //       element: <Salary />,
    //     },
    //   ],
    // },
    // {
    //   path: "other",
    //   children: [
    //     {
    //       path: "leaves",
    //       element: <Leaves />,
    //     },
    //   ],
    // },
    {
      path: "icons",
      children: [
        {
          path: "tabler-icons",
          element: <UtilsTablerIcons />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "material-icons",
          element: <UtilsMaterialIcons />,
        },
      ],
    },
    {
      path: "sample-page",
      element: <SamplePage />,
    },
  ],
};

export default MainRoutes;
