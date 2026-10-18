import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticate, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (isAuthenticate) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;