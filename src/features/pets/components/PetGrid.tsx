import { useEffect, useRef } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { PetCard } from "./PetCard";
import { PetCardSkeleton } from "./PetCardSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/stores/favorites";
import { PageResult } from "../types";

const GRID_COLS = {
  base: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

interface PetGridProps {
  queryKey: string[];
  queryFn: (params: { pageParam: string | number }) => Promise<PageResult>;
  getNextPageParam: (lastPage: PageResult) => string | undefined;
  initialPageParam: string | number;
}

export function PetGrid({
  queryKey,
  queryFn,
  getNextPageParam,
  initialPageParam,
}: PetGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPets,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
  });

  const currentCols =
    breakpoint === "xl"
      ? GRID_COLS.xl
      : breakpoint === "lg"
      ? GRID_COLS.lg
      : breakpoint === "md"
      ? GRID_COLS.md
      : GRID_COLS.base;

  const allPets = data?.pages.flatMap((page) => page.pets) ?? [];
  const remainingCols = allPets.length % currentCols;
  const skeletonsInLastRow =
    remainingCols === 0 ? 0 : currentCols - remainingCols;

  useEffect(() => {
    if (!allPets.length || !hasNextPage) {
      return;
    }

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
    return <p className="text-red-500">Error loading pets: {error.message}</p>;
  }

  if (!isLoadingPets && allPets.length === 0) {
    return <p className="text-muted-foreground text-center">No pets found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoadingPets ? (
          Array.from({ length: currentCols * 2 }).map((_, i) => (
            <PetCardSkeleton key={i} />
          ))
        ) : (
          <>
            {allPets.map((pet) => (
              <PetCard key={pet.id} {...pet} isFavorite={isFavorite(pet.id)} />
            ))}
            {(hasNextPage || isFetchingNextPage) &&
              skeletonsInLastRow > 0 &&
              Array.from({ length: skeletonsInLastRow }).map((_, i) => (
                <PetCardSkeleton key={`fill-${i}`} />
              ))}
          </>
        )}
      </div>

      {!isLoadingPets && hasNextPage && (
        <>
          <div ref={loadMoreRef} className="h-20 mt-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: currentCols }).map((_, i) => (
              <PetCardSkeleton key={`next-${i}`} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
