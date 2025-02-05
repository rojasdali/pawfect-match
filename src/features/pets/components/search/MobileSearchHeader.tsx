import { useState, useEffect } from "react";
import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types";
import { SearchPopover } from "./SearchPopover";

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
          <div className="flex justify-start">
            <QuickFilters onQuickFilter={onQuickFilter} showTooltips={false} />
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
