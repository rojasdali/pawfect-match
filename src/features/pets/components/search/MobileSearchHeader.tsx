import { useState } from "react";
import { SearchInput } from "./SearchInput";
import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types";

interface MobileSearchHeaderProps {
  searchParams: URLSearchParams;
  onSortChange: (value: string) => void;
  onQuickFilter: (type: QuickFilterType) => void;
  onRemoveFilter: (key: string | string[]) => void;
  filterSheetProps: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyFilters: (values: Filters) => void;
  };
}

export function MobileSearchHeader({
  searchParams,
  onSortChange,
  onQuickFilter,
  onRemoveFilter,
  filterSheetProps,
}: MobileSearchHeaderProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  return (
    <div className="container flex flex-col gap-3 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <SearchInput onChange={(e) => console.log(e)} />
        <SortDropdown
          onSortChange={onSortChange}
          currentSort={searchParams.get("sort") || "breed:asc"}
        />
        <FilterSheet
          {...filterSheetProps}
          type="dogs"
          breeds={[]}
          isLoadingBreeds={false}
          defaultValues={{
            breed: "all",
            minAge: "",
            maxAge: "",
          }}
          onResetFilters={() => onRemoveFilter(["breed", "ageMin", "ageMax"])}
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
        <>
          <div className="flex justify-start">
            <QuickFilters onQuickFilter={onQuickFilter} showTooltips={false} />
          </div>
          <FilterPills
            searchParams={searchParams}
            onRemoveFilter={onRemoveFilter}
          />
        </>
      )}
    </div>
  );
}
