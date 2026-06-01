import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";
import DashboardUser from "../pages/Dashboard";
import Login from "../pages/Login";
import QuizTaking from "../pages/QuizTaking";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/admin/Dashboard";
import QuizDetail from "../pages/admin/QuizDetail";

export default function AppRoutes() {
  const router = createBrowserRouter([
    // PUBLIC
    {
      path: "/",
      element: (
        <PublicRoute>
          <MainLayouts />
        </PublicRoute>
      ),
      children: [
        { index: true, element: <Register /> },
        { path: "login", element: <Login /> },
      ],
    },

    // USER ROUTES
    {
      path: "/quiz-list",
      element: (
        <ProtectedRoute role="user">
          <DashboardUser />
        </ProtectedRoute>
      ),
    },
    {
      path: "/quiz/:quizId",
      element: (
        <ProtectedRoute role="user">
          <QuizTaking />
        </ProtectedRoute>
      ),
    },

    // ADMIN ROUTES
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute role="admin">
          <Dashboard />
        </ProtectedRoute>
      ),
    },

    {
      path: "/dashboard/quizzes/:id",
      element: (
        <ProtectedRoute role="admin">
          <QuizDetail />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}