import { useBreeds } from "../hooks/useBreeds";
import { useMemo } from "react";
import { MobileSearchHeader } from "@/features/pets/components/search/MobileSearchHeader";
import { DesktopSearchHeader } from "@/features/pets/components/search/DesktopSearchHeader";
import { useFilters } from "../hooks/useFilters";
import { usePetSearch } from "../hooks/usePetSearch";

export function SearchHeader() {
  const {
    getDefaults,
    applyFilters,
    removeFilter,
    applyQuickFilter,
    searchParams,
    setSearchParams,
  } = useFilters();
  const type = searchParams.get("type") || "dogs";

  const { isLoading: isPetsLoading } = usePetSearch();

  const { data: breeds, isLoading: isLoadingBreeds } = useBreeds({
    enabled: !isPetsLoading,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  const filterSheetProps = useMemo(
    () => ({
      type: "pets",
      breeds: breeds ?? [],
      isLoadingBreeds,
      defaultValues: getDefaults(),
      onApplyFilters: applyFilters,
      onResetFilters: removeFilter,
    }),
    [breeds, isLoadingBreeds, getDefaults, applyFilters, removeFilter]
  );

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MobileSearchHeader
        type={type}
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={(type) => applyQuickFilter(type, breeds)}
        onRemoveFilter={removeFilter}
        filterSheetProps={filterSheetProps}
      />
      <DesktopSearchHeader
        type={type}
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={(type) => applyQuickFilter(type, breeds)}
        onRemoveFilter={removeFilter}
        filterSheetProps={filterSheetProps}
      />
    </div>
  );
}
