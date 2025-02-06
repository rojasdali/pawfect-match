import { PetGrid } from "../components/PetGrid";
import { useFavoritesQuery } from "../hooks/useFavoritesQuery";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SearchHeader } from "../components/SearchHeader";
import { useMemo } from "react";
import { useSearchStateNavigation } from "@/hooks/useSearchStateNavigation";

export function FavoritesPage() {
  const {
    pets,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    clearUnmatchedFromUI,
    clearMatchesFromUI,
    totalFilteredCount,
    optimisticallyRemovePet,
  } = useFavoritesQuery();

  const totalFavorites = useFavoritesStore((state) =>
    state.getTotalFavoriteCount()
  );
  const hasFavorites = totalFavorites > 0;
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const clearMatches = useFavoritesStore((state) => state.clearMatches);

  const [searchParams, setSearchParams] = useSearchParams();
  const { navigateBack } = useSearchStateNavigation();

  const hasActiveFilters =
    searchParams.has("breed") ||
    searchParams.has("ageMin") ||
    searchParams.has("ageMax");

  const unmatchedCount = useFavoritesStore((state) => state.getFavoriteCount());
  const hasUnmatchedFavorites = unmatchedCount > 0;

  const matchedCount = useFavoritesStore(
    (state) => state.getMatchedIds().length
  );
  const hasMatches = matchedCount > 0;

  const isViewingMatches = searchParams.has("matches");
  const title = useMemo(() => {
    if (!hasFavorites) return "Your Favorite Pets";
    if (isLoading) {
      return isViewingMatches ? "Loading matches..." : "Loading favorites...";
    }

    if (isViewingMatches) {
      if (hasActiveFilters) {
        return `${totalFilteredCount} of ${matchedCount} Matches`;
      }
      return `${matchedCount} Matches`;
    }

    if (hasActiveFilters) {
      return `${totalFilteredCount} of ${totalFavorites} Favorites`;
    }

    return `${totalFavorites} Favorites`;
  }, [
    hasFavorites,
    isLoading,
    isViewingMatches,
    matchedCount,
    totalFavorites,
    totalFilteredCount,
    hasActiveFilters,
  ]);

  const handleClearFavorites = () => {
    clearFavorites();
    clearUnmatchedFromUI();
  };

  const handleClearMatches = () => {
    clearMatches();
    clearMatchesFromUI();

    if (searchParams.has("matches")) {
      searchParams.delete("matches");
      setSearchParams(searchParams);
    }
  };

  const handleBackClick = () => {
    navigateBack();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="gap-2 mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Find more furry friends!
        </Button>
      </div>

      <SearchHeader isSearching={isLoading} />

      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            {hasUnmatchedFavorites && !isViewingMatches && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFavorites}
                className="text-red-600 dark:text-red-400 h-8 text-xs sm:h-9 sm:text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear </span>
                favorites
              </Button>
            )}
            {hasMatches && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearMatches}
                className="text-yellow-600 dark:text-yellow-400 h-8 text-xs sm:h-9 sm:text-sm"
              >
                <span className="sm:inline">
                  Clear <Star className="inline-block h-4 w-4 -mt-0.5" />
                  's
                </span>
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
            onPetRemove={optimisticallyRemovePet}
          />
        )}
      </main>
    </div>
  );
}
