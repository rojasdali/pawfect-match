import { petsApi } from "../api/pets";
import { useFavoritesStore } from "@/stores/favorites";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useFavoritesQuery() {
  const favoriteIds = useFavoritesStore((state) => state.getFavoriteIds());
  const hasFavorites = favoriteIds.length > 0;

  const queryKey = ["favorites", favoriteIds];
  const queryFn = async ({ pageParam = "0" }) => {
    const start = Number(pageParam) * 25;
    const end = start + 25;
    const pageIds = favoriteIds.slice(start, end);

    if (pageIds.length === 0) {
      return { pets: [], nextCursor: undefined };
    }

    const pets = await petsApi.getPetsByIds("dogs", pageIds);
    const nextCursor =
      end < favoriteIds.length ? String(Number(pageParam) + 1) : undefined;

    return { pets, nextCursor };
  };

  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    enabled: hasFavorites,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "0",
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });

  return {
    ...query,
    pets: query.data?.pages.flatMap((page) => page.pets) ?? [],
  };
}
