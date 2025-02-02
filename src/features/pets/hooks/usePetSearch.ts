import { useState } from "react";
import { useParams } from "react-router-dom";
import { petsApi } from "../api/pets";
import { PageResult } from "../types";

export function usePetSearch() {
  const [isLoading, setIsLoading] = useState(true);
  const { type } = useParams<{ type: string }>();

  if (!type) {
    throw new Error("Pet type is required");
  }

  const fetchPets = async ({ pageParam = "0" }) => {
    setIsLoading(true);
    try {
      const searchResult = await petsApi.searchPets({
        type,
        pageParam,
      });

      const pets = await petsApi.getPetsByIds(type, searchResult.resultIds);

      let nextCursor: string | undefined;
      if (searchResult.next) {
        try {
          const nextUrl = new URL(searchResult.next);
          nextCursor = nextUrl.searchParams.get("from") ?? undefined;
        } catch {
          const fromMatch = searchResult.next.match(/[?&]from=([^&]*)/);
          nextCursor = fromMatch ? fromMatch[1] : undefined;
        }
      }

      return {
        pets,
        nextCursor,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchPets,
    isLoading,
    getNextPageParam: (lastPage: PageResult) => lastPage.nextCursor,
    initialPageParam: "0",
  };
}
