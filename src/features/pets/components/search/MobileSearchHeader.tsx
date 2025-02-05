import { useState, useEffect } from "react";
import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types/index";
import { SearchPopover } from "./SearchPopover";
import { cn } from "@/lib/utils";

interface MobileSearchHeaderProps {
  type: string;
  searchParams: URLSearchParams;
  onSortChange: (value: string) => void;
  onQuickFilter: (type: QuickFilterType) => void;
  onRemoveFilter: (key: string | string[]) => void;
  onBreedChange: (breed: string) => void;
  breeds: string[];
  isLoadingBreeds: boolean;
  filterSheetProps: {
    type: string;
    breeds: string[];
    isLoadingBreeds: boolean;
    defaultValues: Filters;
    onApplyFilters: (values: Filters) => void;
    onResetFilters: (key: string | string[]) => void;
    onSheetOpen?: () => void;
  };
  locateButton?: React.ReactNode;
  onMatchesFilter?: () => void;
}

export function MobileSearchHeader({
  type,
  searchParams,
  onSortChange,
  onQuickFilter,
  onRemoveFilter,
  onBreedChange,
  breeds,
  isLoadingBreeds,
  filterSheetProps,
  locateButton,
  onMatchesFilter,
}: MobileSearchHeaderProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    setIsFiltersExpanded(false);
  }, []);

  return (
    <div className="container flex flex-col gap-3 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchPopover
            options={breeds}
            value={searchParams.get("breed") ?? "all"}
            onChange={onBreedChange}
            isLoading={isLoadingBreeds}
            placeholder="Filter by breed"
            searchPlaceholder="Search breeds..."
            allOptionText="All Breeds"
          />
        </div>
        <SortDropdown
          onSortChange={onSortChange}
          currentSort={searchParams.get("sort") || "breed:asc"}
        />
        {locateButton}
        <FilterSheet
          {...filterSheetProps}
          type={type}
          breeds={filterSheetProps.breeds ?? []}
          isLoadingBreeds={filterSheetProps.isLoadingBreeds}
          isOpen={isFilterSheetOpen}
          onOpenChange={setIsFilterSheetOpen}
          onSheetOpen={filterSheetProps.onSheetOpen}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
        >
          {isFiltersExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isFiltersExpanded && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <QuickFilters onQuickFilter={onQuickFilter} />
            {onMatchesFilter && (
              <Button
                variant={searchParams.has("matches") ? "default" : "outline"}
                size="icon"
                onClick={onMatchesFilter}
                className={cn(
                  searchParams.has("matches") &&
                    "bg-yellow-500 hover:bg-yellow-600"
                )}
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FilterPills
            searchParams={searchParams}
            onRemoveFilter={onRemoveFilter}
            className="flex-wrap gap-1"
          />
        </div>
      )}
    </div>
  );
}
