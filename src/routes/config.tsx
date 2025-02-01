import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dogs" replace />;
};

export const routeConfig = [
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dogs",
        element: <div>Dogs Page (Coming Soon)</div>, // Placeholder
      },
    ],
  },
];
