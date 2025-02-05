import { PetGrid } from "../components/PetGrid";
import { useFavoritesQuery } from "../hooks/useFavoritesQuery";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export function FavoritesPage() {
  const { pets, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFavoritesQuery();
  const hasFavorites = useFavoritesStore(
    (state) => state.getFavoriteCount() > 0
  );
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (location.state?.from) {
              navigate(location.state.from);
            } else {
              navigate(ROUTES.HOME);
            }
          }}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Find more furry friends!
        </Button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {hasFavorites && isLoading
              ? "Loading favorites..."
              : "Your Favorite Pets"}
          </h1>
          {hasFavorites && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFavorites}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear favorites
            </Button>
          )}
        </div>

        {!hasFavorites ? (
          <p className="text-muted-foreground text-center">
            You haven't added any pets to your favorites yet.
          </p>
        ) : (
          <PetGrid
            pets={pets}
            isLoading={isLoading}
            hasNextPage={!!hasNextPage}
            onLoadMore={() => fetchNextPage()}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </main>
    </div>
  );
}
