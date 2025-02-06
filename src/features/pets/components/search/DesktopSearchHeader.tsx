import { SortDropdown } from "./SortDropdown";
import { FilterSheet } from "../FilterSheet";
import { QuickFilters } from "./QuickFilters";
import { FilterPills } from "./FilterPills";
import { type Filters } from "../../schemas/filters";
import { type QuickFilterType } from "../../types/index";
import { useState } from "react";
import { SearchPopover } from "./SearchPopover";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  onMatchesFilter?: () => void;
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
  onMatchesFilter,
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
          {onMatchesFilter && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={searchParams.has("matches") ? "default" : "outline"}
                  size="sm"
                  onClick={onMatchesFilter}
                  className={cn(
                    "gap-2",
                    searchParams.has("matches") &&
                      "bg-yellow-500 hover:bg-yellow-600"
                  )}
                >
                  <Star className="h-4 w-4" />
                  Matches
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show matched pets only</TooltipContent>
            </Tooltip>
          )}
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
