import { petsApi } from "../api/pets";
import { useFavoritesStore } from "@/stores/favorites";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import { type Pet } from "../types";

interface QueryData {
  pages: Array<{
    pets: Pet[];
    nextCursor?: string;
  }>;
}

export function useFavoritesQuery() {
  const favoriteIds = useFavoritesStore((state) => state.getFavoriteIds());
  const hasFavorites = favoriteIds.length > 0;
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isOnFavoritesPage = location.pathname === "/favorites";

  const queryKey = ["favorites", searchParams.toString()];

  const queryFn = async ({ pageParam = "0" }) => {
    const currentFavoriteIds = useFavoritesStore.getState().getFavoriteIds();
    const start = Number(pageParam) * 25;
    const end = start + 25;
    const pageIds = currentFavoriteIds.slice(start, end);

    if (pageIds.length === 0) {
      return { pets: [], nextCursor: undefined };
    }

    let pets = await petsApi.getPetsByIds("dogs", pageIds);

    if (searchParams.has("breed")) {
      const breed = searchParams.get("breed");
      pets = pets.filter((pet) => pet.breed === breed);
    }

    if (searchParams.has("ageMin") || searchParams.has("ageMax")) {
      const minAge = searchParams.get("ageMin")
        ? Number(searchParams.get("ageMin"))
        : 0;
      const maxAge = searchParams.get("ageMax")
        ? Number(searchParams.get("ageMax"))
        : Infinity;
      pets = pets.filter((pet) => pet.age >= minAge && pet.age <= maxAge);
    }

    const sort = searchParams.get("sort") || "breed:asc";
    const [field, direction] = sort.split(":");
    pets.sort((a, b) => {
      const aValue = a[field as keyof Pet];
      const bValue = b[field as keyof Pet];
      return direction === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    return {
      pets,
      nextCursor:
        end < currentFavoriteIds.length
          ? String(Number(pageParam) + 1)
          : undefined,
    };
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
    queryClient.setQueryData<QueryData>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          pets: page.pets.filter((pet) => pet.id !== petId),
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
