import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
  role?: "admin"; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated, role }) => {
  const userRole = localStorage.getItem("userRole") || "";

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (role === "admin" && userRole !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
