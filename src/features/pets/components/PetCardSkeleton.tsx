import { forwardRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PetCardSkeleton = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Card
      ref={ref}
      className="group overflow-hidden shadow-sm hover:shadow-md dark:shadow-none bg-card"
    >
      {/* Image skeleton with shimmer */}
      <div className="aspect-square relative overflow-hidden rounded-t-md">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeletons */}
      <CardHeader className="space-y-3">
        {/* Name */}
        <Skeleton className="h-6 w-[120px]" />
        {/* Breed */}
        <Skeleton className="h-4 w-[180px]" />
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Age */}
        <Skeleton className="h-4 w-[100px]" />
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
          <Skeleton className="h-4 w-[80px]" /> {/* ZIP code */}
        </div>
      </CardContent>
    </Card>
  );
});

PetCardSkeleton.displayName = "PetCardSkeleton";
