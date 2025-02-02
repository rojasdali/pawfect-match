import { useEffect, useRef } from "react";
import { PetCard } from "../components/PetCard";
import { PetCardSkeleton } from "../components/PetCardSkeleton";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { petsApi } from "../api/pets";
import { useParams } from "react-router-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const GRID_COLS = {
  base: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

export function PetsPage() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();

  const currentCols =
    breakpoint === "xl"
      ? GRID_COLS.xl
      : breakpoint === "lg"
      ? GRID_COLS.lg
      : breakpoint === "md"
      ? GRID_COLS.md
      : GRID_COLS.base;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [type],
    queryFn: async ({ pageParam = "0" }) => {
      const searchResult = await petsApi.searchPets({ type, pageParam });

      const nextUrl = searchResult.next;
      const nextCursor = nextUrl
        ? new URLSearchParams(nextUrl.split("?")[1]).get("from")
        : undefined;

      const pets = await petsApi.getPetsByIds(type, searchResult.resultIds);
      return {
        pets,
        nextCursor,
      };
    },
    initialPageParam: "0",
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });

  const allPets = data?.pages.flatMap((page) => page.pets) ?? [];
  const remainingCols = allPets.length % currentCols;
  const skeletonsInLastRow =
    remainingCols === 0 ? 0 : currentCols - remainingCols;

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
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {isLoading ? `Loading ${type}...` : `Available ${type}`}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              {Array.from({ length: currentCols * 2 }).map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </>
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

              {(hasNextPage || isFetchingNextPage) &&
                skeletonsInLastRow > 0 &&
                Array.from({ length: skeletonsInLastRow }).map((_, i) => (
                  <PetCardSkeleton key={`fill-${i}`} />
                ))}
            </>
          )}
        </div>

        {!isLoading && hasNextPage && (
          <>
            <div ref={loadMoreRef} className="h-20 mt-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: currentCols }).map((_, i) => (
                <PetCardSkeleton key={`next-${i}`} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
