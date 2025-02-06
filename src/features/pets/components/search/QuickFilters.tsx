import { Button } from "@/components/ui/button";
import { PiDog } from "react-icons/pi";
import { GiSittingDog } from "react-icons/gi";
import { MapPin, Shuffle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { type QuickFilterType } from "../../types/index";

interface QuickFiltersProps {
  onQuickFilter: (type: QuickFilterType) => void;
}

export function QuickFilters({ onQuickFilter }: QuickFiltersProps) {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuickFilter("puppy")}
            >
              <PiDog className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Puppies (0-2 years)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuickFilter("senior")}
            >
              <GiSittingDog className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Senior Dogs (7+ years)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuickFilter("random")}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Random Breed
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuickFilter("nearby")}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Nearby (25 miles)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
