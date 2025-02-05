import { PetGrid } from "../components/PetGrid";
import { SearchHeader } from "../components/SearchHeader";
import { useParams } from "react-router-dom";
import { usePetSearch } from "../hooks/usePetSearch";
import { useFilters } from "../hooks/useFilters";

export function SearchPage() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const { isLoadingLocation } = useFilters();
  const {
    pets,
    isLoading: isPetsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    total,
  } = usePetSearch();
  const isLoading = isPetsLoading || isLoadingLocation;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SearchHeader />
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
