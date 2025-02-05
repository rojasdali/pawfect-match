import { type Filters } from "../schemas/filters";
import { type QuickFilterType } from "../types";
import { useSearchParams } from "react-router-dom";

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getDefaults = (): Filters => ({
    breed: searchParams.get("breed") ?? "all",
    minAge: searchParams.get("ageMin") ?? "",
    maxAge: searchParams.get("ageMax") ?? "",
    distance: searchParams.get("distance")
      ? Number(searchParams.get("distance"))
      : null,
  });

  const applyFilters = (values: Filters) => {
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

    if (values.distance === null) {
      newParams.delete("distance");
    } else {
      newParams.set("distance", String(values.distance));
    }

    setSearchParams(newParams);
  };

  const removeFilter = (key: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (Array.isArray(key)) {
      key.forEach((k) => newParams.delete(k));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const applyQuickFilter = async (type: QuickFilterType, breeds?: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (type === "nearby") {
      newParams.set("distance", "25");
    } else if (type === "puppy") {
      newParams.set("ageMin", "0");
      newParams.set("ageMax", "2");
    } else if (type === "senior") {
      newParams.set("ageMin", "7");
      newParams.delete("ageMax");
    } else if (type === "random" && breeds?.length) {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
      newParams.set("breed", randomBreed);
    }

    setSearchParams(newParams);
  };

  return {
    getDefaults,
    applyFilters,
    removeFilter,
    applyQuickFilter,
    searchParams,
    setSearchParams,
  };
}
