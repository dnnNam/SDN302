import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "admin";
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // nếu route yêu cầu admin
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/quiz-list" replace />;
  }

  // nếu route chỉ dành cho user thường (không admin)
  if (role === "user" && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}