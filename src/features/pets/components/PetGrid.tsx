import { useRef } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { PetCard } from "./PetCard";
import { PetCardSkeleton } from "./PetCardSkeleton";
import { PetGridSkeleton } from "./PetGridSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/stores/favorites";
import { GRID_COLUMNS } from "../constants";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface PetGridProps {
  queryKey: string[];
  queryFn: (params: {
    pageParam: string;
  }) => Promise<{ pets: Pet[]; nextCursor: string | undefined }>;
  enabled?: boolean;
}

export function PetGrid({ queryKey, queryFn, enabled = true }: PetGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<
    { pets: Pet[]; nextCursor: string | undefined },
    Error,
    { pets: Pet[]; nextCursor: string | undefined },
    string[],
    string
  >({
    queryKey,
    queryFn,
    enabled,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "0",
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: () => fetchNextPage(),
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const currentCols =
    breakpoint === "xl"
      ? GRID_COLUMNS.xl
      : breakpoint === "lg"
      ? GRID_COLUMNS.lg
      : breakpoint === "md"
      ? GRID_COLUMNS.md
      : GRID_COLUMNS.base;

  if (error) {
    return <p className="text-red-500">Error loading pets: {error.message}</p>;
  }

  if (isLoading) {
    return <PetGridSkeleton columns={4} />;
  }

  const allPets = data?.pages.flatMap((page) => page.pets) ?? [];
  const remainingCols = allPets.length % currentCols;
  const skeletonsInLastRow =
    remainingCols === 0 ? 0 : currentCols - remainingCols;

  if (!isLoading && allPets.length === 0) {
    return <p className="text-muted-foreground text-center">No pets found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <>
          {allPets.map((pet) => (
            <PetCard key={pet.id} {...pet} isFavorite={isFavorite(pet.id)} />
          ))}
          {isFetchingNextPage && skeletonsInLastRow > 0 && (
            <>
              {Array.from({ length: skeletonsInLastRow }).map((_, i) => (
                <PetCardSkeleton key={`fill-${i}`} />
              ))}
            </>
          )}
        </>
      </div>

      {hasNextPage && (
        <>
          <div ref={loadMoreRef} className="h-20 mt-6" />
          {isFetchingNextPage && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: currentCols }).map((_, i) => (
                <PetCardSkeleton key={`next-${i}`} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
