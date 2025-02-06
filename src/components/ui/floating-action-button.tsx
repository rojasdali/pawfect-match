import { Button } from "./button";
import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "./loading-spinner";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function FloatingActionButton({
  onClick,
  className,
  disabled,
  isLoading,
}: FloatingActionButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { type = "dogs" } = useParams(); // Get type from URL params with default
  const isMatchPage = location.pathname.includes("/match");

  const handleClick = () => {
    navigate(`/${type}/match`, {
      state: { from: location.pathname + location.search },
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        "fixed bottom-4 right-4 lg:bottom-6 lg:right-6",
        "bg-[#818CF8] text-white",
        "gap-1.5 lg:gap-2 rounded-full",
        "px-3 py-2 lg:px-4 lg:py-4",
        "h-auto text-xs lg:text-sm font-semibold",
        "min-w-[140px] lg:min-w-[200px]",
        "transition-all duration-300 ease-in-out",
        {
          "shadow-[0_0_15px_rgba(129,140,248,0.5)] hover:bg-[#818CF8]/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(129,140,248,0.7)]":
            !disabled && !isLoading,
          "opacity-90 cursor-not-allowed hover:bg-[#818CF8]/90 shadow-[0_0_25px_rgba(129,140,248,0.8)]":
            disabled || isLoading,
        },
        className
      )}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          <span className="flex-1">Finding match...</span>
        </>
      ) : disabled ? (
        <>
          <PawPrint className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span className="flex-1">Add favorites to match!</span>
        </>
      ) : (
        <>
          <PawPrint className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span className="flex-1">
            {isMatchPage
              ? "Find another pawesome friend!"
              : "Find your pawfect match!"}
          </span>
        </>
      )}
    </Button>
  );
}
