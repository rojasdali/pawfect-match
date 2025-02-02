import { useState } from "react";
import { petsApi } from "../api/pets";
import { Pet } from "../types";

interface PageResult {
  pets: Pet[];
  nextCursor?: string;
}

export function useDogsQuery() {
  const [isLoading, setIsLoading] = useState(true);

  const fetchDogs = async ({ pageParam = "0" }) => {
    console.log("Fetching dogs:", { pageParam });
    setIsLoading(true);
    try {
      const searchResult = await petsApi.searchPets({
        type: "dogs",
        pageParam,
      });
      console.log("Search result:", {
        resultIds: searchResult.resultIds.length,
        next: searchResult.next,
        total: searchResult.total,
      });

      const pets = await petsApi.getPetsByIds("dogs", searchResult.resultIds);
      console.log("Got pets:", { count: pets.length });

      const nextUrl = searchResult.next ? new URL(searchResult.next) : null;
      const nextCursor = nextUrl?.searchParams.get("from") ?? undefined;
      console.log("Next cursor:", { nextCursor });

      const result: PageResult = {
        pets,
        nextCursor,
      };

      return result;
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
