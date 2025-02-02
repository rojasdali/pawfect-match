import { useState } from "react";
import { petsApi } from "../api/pets";
import { useFavoritesStore } from "@/stores/favorites";
import { useAuthStore } from "@/stores/auth";
import { PageResult } from "../types";

export function useFavoritesQuery() {
  const [isLoading, setIsLoading] = useState(true);
  const userEmail = useAuthStore((state) => state.user?.email?.toLowerCase());
  const favorites = useFavoritesStore((state) =>
    userEmail ? state.favorites[userEmail] || [] : []
  );

  const fetchFavorites = async ({
    pageParam = 0,
  }: {
    pageParam: string | number;
  }) => {
    const page =
      typeof pageParam === "string" ? parseInt(pageParam, 10) : pageParam;
    setIsLoading(true);
    try {
      const start = page * 25;
      const end = start + 25;
      const pageIds = favorites.slice(start, end);

      if (pageIds.length === 0) {
        return { pets: [], nextCursor: undefined };
      }

      const pets = await petsApi.getPetsByIds("dogs", pageIds);
      const nextCursor =
        end < favorites.length
          ? (typeof pageParam === "string"
              ? parseInt(pageParam, 10)
              : pageParam) + 1
          : undefined;

      return {
        pets,
        nextCursor: nextCursor?.toString() || undefined,
      };
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
