import { Button } from "./button";
import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function FloatingActionButton({
  onClick,
  className,
  disabled,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "fixed bottom-4 right-4 lg:bottom-6 lg:right-6",
        "bg-[#818CF8] text-white",
        "gap-1.5 lg:gap-2 rounded-full",
        "px-3 py-2 lg:px-4 lg:py-4",
        "h-auto text-xs lg:text-sm font-semibold",
        "min-w-[140px] lg:min-w-[200px]",
        "transition-all duration-300 ease-in-out",
        "shadow-[0_0_15px_rgba(129,140,248,0.5)]",
        {
          "hover:bg-[#818CF8]/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(129,140,248,0.7)]":
            !disabled,
          "opacity-50 cursor-not-allowed": disabled,
        },
        className
      )}
    >
      <PawPrint className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
      <span className="flex-1">
        {disabled ? "Finding match..." : "Find your pawfect match!"}
      </span>
    </Button>
  );
}
