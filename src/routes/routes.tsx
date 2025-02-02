import { LoginPage } from "@/features/auth/pages/LoginPage";
import { PetsPage } from "@/features/pets/pages/PetsPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthLayout } from "@/components/layout/AuthLayout";

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
    path: "/:type",
    element: (
      <ProtectedRoute>
        <PetsPage />
      </ProtectedRoute>
    ),
  },
];
