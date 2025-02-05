import { PetGrid } from "../components/PetGrid";
import { useFavoritesQuery } from "../hooks/useFavoritesQuery";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Star } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { SearchHeader } from "../components/SearchHeader";

export function FavoritesPage() {
  const {
    pets,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    clearUnmatchedFromUI,
    clearMatchesFromUI,
  } = useFavoritesQuery();

  const totalFavorites = useFavoritesStore((state) =>
    state.getTotalFavoriteCount()
  );
  const hasFavorites = totalFavorites > 0;
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const clearMatches = useFavoritesStore((state) => state.clearMatches);
  const matchedCount = useFavoritesStore(
    (state) => state.getMatchedIds().length
  );
  const hasMatches = matchedCount > 0;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasActiveFilters =
    searchParams.has("breed") ||
    searchParams.has("ageMin") ||
    searchParams.has("ageMax");

  const unmatchedCount = useFavoritesStore((state) => state.getFavoriteCount());
  const hasUnmatchedFavorites = unmatchedCount > 0;

  const handleClearFavorites = () => {
    clearFavorites();
    clearUnmatchedFromUI();
  };

  const handleClearMatches = () => {
    clearMatches();
    clearMatchesFromUI();
  };

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

      <SearchHeader isSearching={isLoading} />

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
          <div className="flex items-center gap-2">
            {hasUnmatchedFavorites && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFavorites}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear favorites
              </Button>
            )}
            {hasMatches && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearMatches}
                className="text-yellow-600 dark:text-yellow-400"
              >
                <Star className="h-4 w-4 mr-2" />
                Clear matches
              </Button>
            )}
          </div>
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
