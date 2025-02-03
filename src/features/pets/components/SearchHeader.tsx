import { useSearchParams } from "react-router-dom";
import { useBreeds } from "../hooks/useBreeds";
import { useState, useMemo } from "react";
import { type Filters } from "../schemas/filters";
import { MobileSearchHeader } from "@/features/pets/components/search/MobileSearchHeader";
import { DesktopSearchHeader } from "@/features/pets/components/search/DesktopSearchHeader";
import { type QuickFilterType } from "../types";

export function SearchHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") || "dogs";
  const [shouldFetchBreeds, setShouldFetchBreeds] = useState(false);

  const { data: breeds, isLoading: isLoadingBreeds } = useBreeds({
    enabled: shouldFetchBreeds,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });

  const handleSortChange = (value: string) => {
    searchParams.set("sort", value);
    setSearchParams(searchParams);
  };

  const handleFilterApply = (values: Filters) => {
    const newParams = new URLSearchParams(searchParams);

    if (values.minAge) {
      newParams.set("ageMin", values.minAge);
    } else {
      newParams.delete("ageMin");
    }

    if (values.maxAge) {
      newParams.set("ageMax", values.maxAge);
    } else {
      newParams.delete("ageMax");
    }

    if (values.breed === "all") {
      newParams.delete("breed");
    } else {
      newParams.set("breed", values.breed);
    }

    setSearchParams(newParams);
  };

  const handleQuickFilter = (type: QuickFilterType) => {
    const newParams = new URLSearchParams(searchParams);

    if (type === "puppy") {
      newParams.set("ageMin", "0");
      newParams.set("ageMax", "2");
    } else if (type === "senior") {
      newParams.set("ageMin", "7");
      newParams.delete("ageMax");
    } else if (type === "random") {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
      newParams.set("breed", randomBreed);
    } else if (type === "nearby") {
      newParams.set("distance", "25");
    }

    setSearchParams(newParams);
  };

  const handleRemoveFilter = (key: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (Array.isArray(key)) {
      key.forEach((k) => newParams.delete(k));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const filterSheetProps = useMemo(
    () => ({
      type: "pets",
      breeds: breeds ?? [],
      isLoadingBreeds,
      defaultValues: {
        minAge: searchParams.get("minAge") ?? "",
        maxAge: searchParams.get("maxAge") ?? "",
        breed: searchParams.get("breed") ?? "all",
      },
      onApplyFilters: handleFilterApply,
      onResetFilters: handleRemoveFilter,
      onSheetOpen: () => {
        console.log("Sheet opened, setting shouldFetchBreeds to true");
        setShouldFetchBreeds(true);
      },
    }),
    [
      breeds,
      isLoadingBreeds,
      searchParams,
      handleFilterApply,
      handleRemoveFilter,
    ]
  );

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MobileSearchHeader
        type={type}
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={handleQuickFilter}
        onRemoveFilter={handleRemoveFilter}
        filterSheetProps={filterSheetProps}
      />
      <DesktopSearchHeader
        type={type}
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={handleQuickFilter}
        onRemoveFilter={handleRemoveFilter}
        filterSheetProps={filterSheetProps}
      />
    </div>
  );
}
