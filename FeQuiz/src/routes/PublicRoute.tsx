import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const token = localStorage.getItem("token");

  if (token) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    return (
      <Navigate
        to={isAdmin ? "/dashboard" : "/quiz-list"}
        replace
      />
    );
  }

  return <>{children}</>;
}