import { JSX } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("id_token");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
};
