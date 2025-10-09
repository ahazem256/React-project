import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded) {
      return <>{children}</>;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/auth/signin" replace />;
  }

  return <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;
