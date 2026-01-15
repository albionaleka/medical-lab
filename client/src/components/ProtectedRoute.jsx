import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { hasAnyRole } from "../utils/roles";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { loggedIn, token } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!loggedIn || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(user.role, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
