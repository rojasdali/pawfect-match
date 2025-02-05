import { petsApi } from "../api/pets";
import { useFavoritesStore } from "@/stores/favorites";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

export function useFavoritesQuery() {
  const favoriteIds = useFavoritesStore((state) => state.getFavoriteIds());
  const hasFavorites = favoriteIds.length > 0;
  const queryClient = useQueryClient();
  const location = useLocation();
  const isOnFavoritesPage = location.pathname === "/favorites";

  const queryKey = ["favorites"];

  const queryFn = async ({ pageParam = "0" }) => {
    const currentFavoriteIds = useFavoritesStore.getState().getFavoriteIds();
    const start = Number(pageParam) * 25;
    const end = start + 25;
    const pageIds = currentFavoriteIds.slice(start, end);

    if (pageIds.length === 0) {
      return { pets: [], nextCursor: undefined };
    }

    const pets = await petsApi.getPetsByIds("dogs", pageIds);
    const nextCursor =
      end < currentFavoriteIds.length
        ? String(Number(pageParam) + 1)
        : undefined;

    return { pets, nextCursor };
  };

  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    enabled: hasFavorites && isOnFavoritesPage,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "0",
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });

  const removePet = (petId: string) => {
    queryClient.setQueryData<any>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          pets: page.pets.filter((pet: Pet) => pet.id !== petId),
        })),
      };
    });
  };

  return {
    ...query,
    pets: query.data?.pages.flatMap((page) => page.pets) ?? [],
    removePet,
  };
}
