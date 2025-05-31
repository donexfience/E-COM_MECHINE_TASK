import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "@/store";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ openLoginModal: true, from: location }}
        replace
      />
    );
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
