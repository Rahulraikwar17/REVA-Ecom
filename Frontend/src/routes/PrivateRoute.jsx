import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const isAuthenticate = useSelector((state) => state.auth.isAuthenticate);

  if (!isAuthenticate) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
