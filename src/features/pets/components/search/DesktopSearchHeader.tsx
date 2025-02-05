import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types";
import { useState } from "react";
import { SearchPopover } from "./SearchPopover";

interface DesktopSearchHeaderProps {
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
}

export function DesktopSearchHeader({
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
}: DesktopSearchHeaderProps) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <div className="hidden lg:block">
      <div className="container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <SortDropdown
            onSortChange={onSortChange}
            currentSort={searchParams.get("sort") || "breed:asc"}
            showText={true}
          />
          <QuickFilters onQuickFilter={onQuickFilter} />
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
        </div>
        <div className="w-96">
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
      </div>
      <div className="container py-2">
        <FilterPills
          searchParams={searchParams}
          onRemoveFilter={onRemoveFilter}
        />
      </div>
    </div>
  );
}
