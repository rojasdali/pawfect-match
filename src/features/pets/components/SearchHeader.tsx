import { useSearchParams } from "react-router-dom";
import { useBreeds } from "../hooks/useBreeds";
import { useState } from "react";
import { type Filters } from "../schemas/filters";
import { MobileSearchHeader } from "@/features/pets/components/search/MobileSearchHeader";
import { DesktopSearchHeader } from "@/features/pets/components/search/DesktopSearchHeader";
import { type QuickFilterType } from "../types";

export function SearchHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const { data: breeds = [] } = useBreeds({
    enabled: isOpen,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  const filterSheetProps = {
    isOpen,
    onOpenChange: setIsOpen,
    onApplyFilters: handleFilterApply,
    type: "dogs",
    breeds,
    isLoadingBreeds: false,
    defaultValues: {
      breed: searchParams.get("breed") || "all",
      minAge: searchParams.get("ageMin") || "",
      maxAge: searchParams.get("ageMax") || "",
    },
    onResetFilters: () => handleRemoveFilter(["breed", "ageMin", "ageMax"]),
  };

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MobileSearchHeader
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={handleQuickFilter}
        onRemoveFilter={handleRemoveFilter}
        filterSheetProps={filterSheetProps}
      />
      <DesktopSearchHeader
        searchParams={searchParams}
        onSortChange={handleSortChange}
        onQuickFilter={handleQuickFilter}
        onRemoveFilter={handleRemoveFilter}
        filterSheetProps={filterSheetProps}
      />
    </div>
  );
}
