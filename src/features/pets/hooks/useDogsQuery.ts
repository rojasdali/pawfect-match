import { useState } from "react";
import { petsApi } from "../api/pets";
import { PageResult } from "../types";

export function useDogsQuery() {
  const [isLoading, setIsLoading] = useState(true);

  const fetchDogs = async ({ pageParam = "0" }) => {
    setIsLoading(true);
    try {
      const searchResult = await petsApi.searchPets({
        type: "dogs",
        pageParam,
      });

      const pets = await petsApi.getPetsByIds("dogs", searchResult.resultIds);

      const nextUrl = searchResult.next ? new URL(searchResult.next) : null;
      const nextCursor = nextUrl?.searchParams.get("from") ?? undefined;

      return {
        pets,
        nextCursor,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchDogs,
    isLoading,
    getNextPageParam: (lastPage: PageResult) => lastPage.nextCursor,
    initialPageParam: "0",
  };
}
