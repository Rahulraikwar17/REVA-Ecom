
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  const isAuthenticate = useSelector(
    (state) => state.auth.isAuthenticate
  );

  if (isAuthenticate) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

