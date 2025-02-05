import { useRef } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { PetCard } from "./PetCard";
import { PetCardSkeleton } from "./PetCardSkeleton";
import { PetGridSkeleton } from "./PetGridSkeleton";
import { useFavoritesStore } from "@/stores/favorites";
import { GRID_COLUMNS } from "../constants";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { type Pet } from "../types";

interface PetGridProps {
  pets: Pet[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}

export function PetGrid({
  pets,
  isLoading,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
}: PetGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: onLoadMore,
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

  if (isLoading) {
    return <PetGridSkeleton columns={4} />;
  }

  if (pets.length === 0) {
    return <p className="text-muted-foreground text-center">No pets found.</p>;
  }

  const remainingCols = pets.length % currentCols;
  const skeletonsInLastRow =
    remainingCols === 0 ? 0 : currentCols - remainingCols;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <>
          {pets.map((pet) => (
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
