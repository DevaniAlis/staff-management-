import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate, Outlet, Route, Routes } from "react-router";
import Staff from "views/staff/staff";
import { Component } from "react";
import { element } from "prop-types";

// Check if the token exists in localStorage
const isTokenAvailable = localStorage.getItem("token");
console.log(isTokenAvailable);

// Protected route component to handle access based on token
const ProtectedRoute = ({ element: Element, ...rest }) => {
  console.log("element", Element);
  // return isTokenAvailable ? (
  //   <Routes>
  //     <Route {...rest} element={<Element />} />
  //   </Routes>
  // ) : (
  //   <Navigate to="/" />
  // );
  <Routes>
    <Route
      {...rest}
      render={(props) => {
        isTokenAvailable === true ? (
          <Component {...props} />
        ) : (
          <Navigate to="/" />
        );
      }}
    />
  </Routes>;
};

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

// const Staff = Loadable(lazy(() => import("../views/staff/staff")));
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
    // {
    //   path: "/dashboard",
    //   element: <ProtectedRoute path="/dashboard" element={DashboardDefault} />,
    // },
    // {
    //   path: "/staff",
    //   element: <ProtectedRoute path="/staff" element={Staff} />,
    // },
    {
      path:"dashboard",
      Component:"dashboard",
      element: <DashboardDefault />,
    },
    {
      path:"staff",
      Component:"staff",
      element: <Staff/>
    },
    // {
    //   path: "transaction",
    //   element: <ProtectedRoute element={Transaction} />,
    // },
    // {
    //   path: "leaves",
    //   element: <ProtectedRoute element={Leaves} />,
    // },
    // {
    //   path: "salary",
    //   element: <ProtectedRoute element={Salary} />,
    // },
  ],
};

export default MainRoutes;
