import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_LABELS: Record<string, string> = {
  "breed:asc": "Breed A-Z",
  "breed:desc": "Breed Z-A",
  "age:asc": "Age: Youngest",
  "age:desc": "Age: Oldest",
};

interface FilterPillsProps {
  searchParams: URLSearchParams;
  onRemoveFilter: (key: string | string[]) => void;
  className?: string;
}

export function FilterPills({
  searchParams,
  onRemoveFilter,
  className,
}: FilterPillsProps) {
  const locationParam = searchParams.get("location");
  let location = null;
  if (locationParam) {
    try {
      location = JSON.parse(locationParam);
    } catch (e) {
      console.error("Failed to parse location from URL", e);
    }
  }

  const sort = searchParams.get("sort");
  const sortLabel = sort ? SORT_LABELS[sort] : null;

  // Count active filters
  const activeFilters = [
    searchParams.get("breed"),
    searchParams.get("ageMin") || searchParams.get("ageMax"),
    location,
    sort && sort !== "breed:asc" ? sort : null,
  ].filter(Boolean).length;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
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
      {location && (
        <Badge variant="secondary" className="gap-1">
          {location.display}
          {searchParams.get("distance") &&
            ` (${searchParams.get("distance")} miles)`}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter(["location", "distance"])}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {sort && sort !== "breed:asc" && sortLabel && (
        <Badge variant="secondary" className="gap-1">
          {sortLabel}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter("sort")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {activeFilters > 1 && (
        <Badge
          variant="secondary"
          className="gap-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
        >
          Clear all
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() =>
              onRemoveFilter([
                "breed",
                "ageMin",
                "ageMax",
                "location",
                "distance",
                "sort",
              ])
            }
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
}
