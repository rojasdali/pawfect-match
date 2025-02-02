import { Navigate, useLocation, Outlet } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { PetsPage } from "@/features/pets/pages/PetsPage";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { useAuthStore } from "@/stores/auth";

const VALID_PET_TYPES = ["dogs"] as const;
type PetType = (typeof VALID_PET_TYPES)[number];

function isValidPetType(type: string): type is PetType {
  return VALID_PET_TYPES.includes(type as PetType);
}

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const pathType = location.pathname.split("/")[1];

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === "/") {
    return <Navigate to="/dogs" replace />;
  }

  if (pathType && !isValidPetType(pathType)) {
    return <NotFoundPage />;
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
            path: ":type",
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
