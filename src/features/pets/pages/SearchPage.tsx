import { PetGrid } from "../components/PetGrid";
import { SearchHeader } from "../components/SearchHeader";
import { useParams, useLocation } from "react-router-dom";
import { usePetSearch } from "../hooks/usePetSearch";
import { useFilters } from "../hooks/useFilters";
import { useSearchStateNavigation } from "@/hooks/useSearchStateNavigation";
import { useEffect } from "react";

export function SearchPage() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const location = useLocation();
  const { saveSearchState } = useSearchStateNavigation();
  const { isLoadingLocation } = useFilters();
  const {
    data,
    isLoading: isSearching,
    isLoading: isPetsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    total,
  } = usePetSearch();

  const isLoading = isPetsLoading || isLoadingLocation;

  const pets = data?.pages.flatMap((page) => page.pets) ?? [];

  useEffect(() => {
    saveSearchState();
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SearchHeader isSearching={isSearching} />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {isLoading
            ? `Loading ${type}...`
            : `${total.toLocaleString()} Available ${type}`}
        </h1>
        <PetGrid
          pets={pets}
          isLoading={isLoading}
          hasNextPage={!!hasNextPage}
          onLoadMore={() => fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
        />
      </main>
    </div>
  );
}
