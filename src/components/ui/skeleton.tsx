import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60 dark:bg-white/10",
        "relative overflow-hidden",
        "after:absolute after:inset-0",
        "after:translate-x-[-100%]",
        "after:animate-[shimmer_2.5s_ease-in-out_infinite]",
        "after:bg-gradient-to-r",
        "after:from-transparent after:via-white/10 after:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
