import { PetGrid } from "../components/PetGrid";
import { SearchHeader } from "../components/SearchHeader";
import { useParams } from "react-router-dom";
import { usePetSearch } from "../hooks/usePetSearch";

export function SearchPage() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const { pets, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePetSearch();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SearchHeader />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">Available {type}</h1>
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
