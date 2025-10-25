import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute: React.FC = () => {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
