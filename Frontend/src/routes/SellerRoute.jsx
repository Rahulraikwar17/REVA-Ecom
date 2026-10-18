import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// Only sellers can open the routes inside this guard.
// Note: the real protection is the role check on the backend.
const SellerRoute = () => {
  const user = useSelector((state) => state.auth.user);

  if (user?.role !== "seller") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;