import { SearchInput } from "./SearchInput";
import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types";

interface DesktopSearchHeaderProps {
  searchParams: URLSearchParams;
  onSortChange: (value: string) => void;
  onQuickFilter: (type: QuickFilterType) => void;
  onRemoveFilter: (key: string | string[]) => void;
  filterSheetProps: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyFilters: (values: Filters) => void;
    type: string;
    breeds: string[];
    isLoadingBreeds: boolean;
    defaultValues: Filters;
    onResetFilters: () => void;
  };
}

export function DesktopSearchHeader({
  searchParams,
  onSortChange,
  onQuickFilter,
  onRemoveFilter,
  filterSheetProps,
}: DesktopSearchHeaderProps) {
  return (
    <div className="hidden lg:flex flex-col container gap-3 py-3">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <SortDropdown
            onSortChange={onSortChange}
            showText={true}
            currentSort={searchParams.get("sort") || "breed:asc"}
          />
          <QuickFilters onQuickFilter={onQuickFilter} showTooltips={true} />
          <FilterSheet {...filterSheetProps} />
        </div>

        <div className="relative w-full max-w-sm">
          <SearchInput onChange={(e) => console.log(e)} />
        </div>
      </div>
      {(searchParams.get("breed") ||
        searchParams.get("ageMin") ||
        searchParams.get("ageMax")) && (
        <FilterPills
          searchParams={searchParams}
          onRemoveFilter={onRemoveFilter}
        />
      )}
    </div>
  );
}
