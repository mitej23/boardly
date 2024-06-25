import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return user ? <Outlet /> : <Navigate to={`/login?redirect=${pathname}`} />;
};

export default ProtectedRoutes;
