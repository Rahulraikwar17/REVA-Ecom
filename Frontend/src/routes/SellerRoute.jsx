import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const SellerRoute = () => {
  const user = useSelector((state) => state.auth.user);

  if (user?.role !== "seller") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;