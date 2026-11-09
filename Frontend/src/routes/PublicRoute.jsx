import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticate, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (isAuthenticate) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;