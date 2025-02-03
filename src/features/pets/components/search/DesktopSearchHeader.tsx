import { SearchInput } from "./SearchInput";
import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types";
import { useState } from "react";

interface DesktopSearchHeaderProps {
  type: string;
  searchParams: URLSearchParams;
  onSortChange: (value: string) => void;
  onQuickFilter: (type: QuickFilterType) => void;
  onRemoveFilter: (key: string | string[]) => void;
  filterSheetProps: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyFilters: (values: Filters) => void;
    breeds: string[];
    isLoadingBreeds: boolean;
    defaultValues: Filters;
    onResetFilters: () => void;
  };
}

export function DesktopSearchHeader({
  type,
  searchParams,
  onSortChange,
  onQuickFilter,
  onRemoveFilter,
  filterSheetProps,
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
          <QuickFilters onQuickFilter={onQuickFilter} showTooltips={true} />
          <FilterSheet
            {...filterSheetProps}
            type={type}
            breeds={filterSheetProps.breeds ?? []}
            isLoadingBreeds={filterSheetProps.isLoadingBreeds}
            defaultValues={{
              breed: searchParams.get("breed") ?? "all",
              minAge: searchParams.get("ageMin") ?? "",
              maxAge: searchParams.get("ageMax") ?? "",
            }}
            onResetFilters={() => onRemoveFilter(["breed", "ageMin", "ageMax"])}
            isOpen={isFilterSheetOpen}
            onOpenChange={setIsFilterSheetOpen}
            onSheetOpen={filterSheetProps.onSheetOpen}
          />
        </div>
        <div className="w-96">
          <SearchInput onChange={(e) => console.log(e)} />
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
