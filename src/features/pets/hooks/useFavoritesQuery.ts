import { useState } from "react";
import { petsApi } from "../api/pets";
import { useFavoritesStore } from "@/stores/favorites";
import { Pet } from "../types";
import { PageResult } from "../types";

export function useFavoritesQuery() {
  const [isLoading, setIsLoading] = useState(true);
  const favorites = useFavoritesStore((state) => state.favorites);

  const fetchFavorites = async ({
    pageParam = 0,
  }: {
    pageParam: string | number;
  }) => {
    const page =
      typeof pageParam === "string" ? parseInt(pageParam, 10) : pageParam;
    console.log("Fetching favorites:", { pageParam });
    setIsLoading(true);
    try {
      const start = page * 25;
      const end = start + 25;
      const pageIds = favorites.slice(start, end);

      if (pageIds.length === 0) {
        return { pets: [], nextCursor: undefined };
      }

      const pets = await petsApi.getPetsByIds("dogs", pageIds);
      console.log("Got favorite pets:", { count: pets.length });

      const nextCursor =
        end < favorites.length
          ? (typeof pageParam === "string"
              ? parseInt(pageParam, 10)
              : pageParam) + 1
          : undefined;
      console.log("Next cursor:", { nextCursor });

      const result: PageResult = {
        pets,
        nextCursor: nextCursor?.toString() || undefined,
      };

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchFavorites,
    isLoading,
    getNextPageParam: (lastPage: PageResult) => lastPage.nextCursor,
    initialPageParam: 0,
  };
}
