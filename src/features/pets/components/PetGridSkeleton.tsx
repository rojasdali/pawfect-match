import { PetCardSkeleton } from "./PetCardSkeleton";

interface PetGridSkeletonProps {
  columns: number;
  rows?: number;
}

export function PetGridSkeleton({ columns, rows = 2 }: PetGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: columns * rows }).map((_, i) => (
        <PetCardSkeleton key={i} />
      ))}
    </div>
  );
}
