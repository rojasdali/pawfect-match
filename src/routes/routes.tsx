import { Navigate, useLocation, Outlet } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { PetsPage } from "@/features/pets/pages/PetsPage";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { useAuthStore } from "@/stores/auth";
import { FavoritesPage } from "@/features/pets/pages/FavoritesPage";

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export const routes = [
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dogs" replace />,
          },
          {
            path: "favorites",
            element: <FavoritesPage />,
          },
          {
            path: "dogs",
            element: <PetsPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];
