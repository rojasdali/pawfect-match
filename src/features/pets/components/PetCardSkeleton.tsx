import { forwardRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PetCardSkeleton = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Card
      ref={ref}
      className="group shadow-sm hover:shadow-md dark:shadow-none bg-[#F1F5F9] dark:bg-card p-3"
    >
      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
});

PetCardSkeleton.displayName = "PetCardSkeleton";
