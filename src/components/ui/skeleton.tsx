import { cn } from "@/lib/utils";
import React from "react";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-pulse rounded-md",
      "bg-muted/80 dark:bg-muted/40",
      "before:absolute before:inset-0",
      "before:-translate-x-full",
      "before:animate-[shimmer_2s_infinite]",
      "before:bg-gradient-to-r",
      "before:from-transparent before:via-muted-foreground/40 before:to-transparent",
      "dark:before:via-muted-foreground/30",
      "relative overflow-hidden",
      className
    )}
    {...props}
  />
));

export { Skeleton };
