import { useBreeds } from "../hooks/useBreeds";
import { useMemo } from "react";
import { MobileSearchHeader } from "@/features/pets/components/search/MobileSearchHeader";
import { DesktopSearchHeader } from "@/features/pets/components/search/DesktopSearchHeader";
import { useFilters } from "../hooks/useFilters";
import { useLocation } from "react-router-dom";

interface SearchHeaderProps {
  isSearching?: boolean;
}

export function SearchHeader({ isSearching }: SearchHeaderProps) {
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";
  const {
    getDefaults,
    applyFilters,
    removeFilter,
    applyQuickFilter,
    searchParams,
    setSearchParams,
  } = useFilters();
  const type = searchParams.get("type") || "dogs";

  const { data: breeds, isLoading: isLoadingBreeds } = useBreeds(!isSearching);

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  const handleBreedChange = (breed: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (breed === "all") {
      newParams.delete("breed");
    } else {
      newParams.set("breed", breed);
    }
    setSearchParams(newParams);
  };

  const handleMatchesFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.has("matches")) {
      newParams.delete("matches");
    } else {
      newParams.set("matches", "true");
    }
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
        onBreedChange={handleBreedChange}
        onMatchesFilter={isFavoritesPage ? handleMatchesFilter : undefined}
        breeds={breeds ?? []}
        isLoadingBreeds={isLoadingBreeds}
        filterSheetProps={filterSheetProps}
      />
      <DesktopSearchHeader
        type={type}
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={(type) => applyQuickFilter(type, breeds)}
        onRemoveFilter={removeFilter}
        onBreedChange={handleBreedChange}
        onMatchesFilter={isFavoritesPage ? handleMatchesFilter : undefined}
        breeds={breeds ?? []}
        isLoadingBreeds={isLoadingBreeds}
        filterSheetProps={filterSheetProps}
      />
    </div>
  );
}
