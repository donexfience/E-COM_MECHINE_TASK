import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  
  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ openLoginModal: true, requireAdmin: true }}
        replace
      />
    );
  }
  

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;