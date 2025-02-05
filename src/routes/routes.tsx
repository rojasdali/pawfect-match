import {
  Navigate,
  useLocation,
  Outlet,
  LoaderFunctionArgs,
} from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SearchPage } from "@/features/pets/pages/SearchPage";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { useAuthStore } from "@/stores/auth";
import { FavoritesPage } from "@/features/pets/pages/FavoritesPage";
import { ROUTES } from "@/config/routes";

const VALID_PET_TYPES = ["dogs"] as const;
type PetType = (typeof VALID_PET_TYPES)[number];

function isPetType(type: string): type is PetType {
  return VALID_PET_TYPES.includes(type as PetType);
}

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${ROUTES.LOGIN}${location.search}`}
        state={{ from: location }}
        replace
      />
    );
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
            element: <Navigate to={ROUTES.HOME} replace />,
          },
          {
            path: "search/:type",
            element: <SearchPage />,
            errorElement: <NotFoundPage />,
            loader: ({ params }: LoaderFunctionArgs) => {
              if (!params.type || !isPetType(params.type)) {
                throw new Error("Invalid pet type");
              }
              return null;
            },
          },
          {
            path: "favorites",
            element: <FavoritesPage />,
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
