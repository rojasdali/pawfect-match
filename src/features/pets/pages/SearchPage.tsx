import { useEffect, useRef } from "react";
import { PetCard } from "../components/PetCard";
import { PetCardSkeleton } from "../components/PetCardSkeleton";
import { SearchHeader } from "../components/SearchHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petsApi } from "../api/pets";
import { useParams } from "react-router-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { usePetSearch } from "../hooks/usePetSearch";
import { PetGridSkeleton } from "../components/PetGridSkeleton";

const GRID_COLS = {
  base: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

export function SearchPage() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();

  const {
    allPets,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPets,
    error,
  } = usePetSearch();

  const currentCols =
    breakpoint === "xl"
      ? GRID_COLS.xl
      : breakpoint === "lg"
      ? GRID_COLS.lg
      : breakpoint === "md"
      ? GRID_COLS.md
      : GRID_COLS.base;

  const remainingCols = allPets.length % currentCols;
  const fillCols = remainingCols === 0 ? 0 : currentCols - remainingCols;

  const favoriteMutation = useMutation({
    mutationFn: (id: string) => petsApi.toggleFavorite(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  useEffect(() => {
    if (!allPets.length || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, allPets]);

  const hasPets = allPets.length > 0;

  const getTitle = () => {
    if (isLoadingPets) return `Loading ${type}...`;
    if (hasPets) return `Available ${type}`;
    return `Woof! No ${type} found`;
  };

  if (!breakpoint || (isLoadingPets && !allPets.length)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SearchHeader />
        <main className="container py-6">
          <h1 className="text-2xl font-bold mb-6 capitalize">
            Loading {type}...
          </h1>
          <PetGridSkeleton columns={GRID_COLS.xl} rows={2} />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container py-6">
          <p className="text-red-500">Error loading pets: {error.message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SearchHeader />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">{getTitle()}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!hasPets ? (
            <p className="text-muted-foreground text-center col-span-full">
              Try checking back later for more adorable pups!
            </p>
          ) : (
            <>
              {allPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  {...pet}
                  isFavorite={false}
                  onFavorite={() => favoriteMutation.mutate(pet.id)}
                />
              ))}

              {isFetchingNextPage && (
                <>
                  {fillCols > 0 &&
                    Array.from({ length: fillCols }).map((_, i) => (
                      <PetCardSkeleton key={`fill-${i}`} />
                    ))}
                  {Array.from({ length: currentCols }).map((_, i) => (
                    <PetCardSkeleton key={`next-${i}`} />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {hasNextPage && <div ref={loadMoreRef} className="h-20 mt-6" />}
      </main>
    </div>
  );
}
