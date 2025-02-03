import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterPillsProps {
  searchParams: URLSearchParams;
  onRemoveFilter: (key: string | string[]) => void;
}

export function FilterPills({
  searchParams,
  onRemoveFilter,
}: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {searchParams.get("breed") && (
        <Badge variant="secondary" className="gap-1">
          {searchParams.get("breed")}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter("breed")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {(searchParams.get("ageMin") || searchParams.get("ageMax")) && (
        <Badge variant="secondary" className="gap-1">
          {searchParams.get("ageMin") || "0"}
          {" - "}
          {searchParams.get("ageMax") || "∞"} years
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter(["ageMin", "ageMax"])}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {searchParams.get("distance") && (
        <Badge variant="secondary" className="gap-1">
          Within {searchParams.get("distance")} miles
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter("distance")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
}
