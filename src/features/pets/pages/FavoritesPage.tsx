import { PetGrid } from "../components/PetGrid";
import { useFavoritesQuery } from "../hooks/useFavoritesQuery";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { SearchHeader } from "../components/SearchHeader";

export function FavoritesPage() {
  const { pets, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFavoritesQuery();
  const totalFavorites = useFavoritesStore((state) => state.getFavoriteCount());
  const hasFavorites = totalFavorites > 0;
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasActiveFilters =
    searchParams.has("breed") ||
    searchParams.has("ageMin") ||
    searchParams.has("ageMax");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container">
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
          className="gap-2 mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Find more furry friends!
        </Button>
      </div>

      <SearchHeader />

      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {hasFavorites && isLoading ? (
              "Loading favorites..."
            ) : hasFavorites ? (
              hasActiveFilters ? (
                <>
                  {pets.length} of {totalFavorites} favorite pets
                </>
              ) : (
                <>Your {totalFavorites} favorite pets!</>
              )
            ) : (
              "Your Favorite Pets"
            )}
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
