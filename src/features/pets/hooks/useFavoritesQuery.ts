import { petsApi } from "../api/pets";
import { useFavoritesStore } from "@/stores/favorites";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import { type Pet } from "../types";
import { useState } from "react";

interface QueryData {
  pages: Array<{
    pets: Pet[];
    nextCursor?: string;
    totalFilteredCount: number;
  }>;
}

export function useFavoritesQuery() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isOnFavoritesPage = location.pathname === "/favorites";
  const isViewingMatches = searchParams.has("matches");

  const favoriteIds = useFavoritesStore((state) =>
    isViewingMatches
      ? state.getMatchedIds()
      : state.getFavoriteIds({ excludeMatched: false })
  );

  const hasFavorites = favoriteIds.length > 0;
  const queryClient = useQueryClient();

  const queryKey = ["favorites", searchParams.toString()];

  const [totalFilteredCount, setTotalFilteredCount] = useState(0);

  const queryFn = async ({ pageParam = "0" }) => {
    const start = Number(pageParam) * 25;
    const end = start + 25;
    const pageIds = favoriteIds.slice(start, end);

    if (pageIds.length === 0) {
      return { pets: [], nextCursor: undefined, totalFilteredCount };
    }

    let pets = await petsApi.getPetsByIds("dogs", pageIds);

    if (searchParams.has("matches")) {
      pets = pets.filter((pet) =>
        useFavoritesStore.getState().isMatched(pet.id)
      );
    }

    if (pageParam === "0") {
      const allPets = await petsApi.getPetsByIds("dogs", favoriteIds);
      let filteredPets = allPets;

      if (searchParams.has("breed")) {
        const breed = searchParams.get("breed");
        filteredPets = filteredPets.filter((pet) => pet.breed === breed);
      }

      if (searchParams.has("ageMin") || searchParams.has("ageMax")) {
        const minAge = searchParams.get("ageMin")
          ? Number(searchParams.get("ageMin"))
          : 0;
        const maxAge = searchParams.get("ageMax")
          ? Number(searchParams.get("ageMax"))
          : Infinity;
        filteredPets = filteredPets.filter(
          (pet) => pet.age >= minAge && pet.age <= maxAge
        );
      }

      setTotalFilteredCount(filteredPets.length);
    }

    // Apply other filters
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
        pets.length === 25 ? String(Number(pageParam) + 1) : undefined,
      totalFilteredCount,
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

  const optimisticallyRemovePet = (petId: string) => {
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

  const clearUnmatchedFromUI = () => {
    queryClient.setQueryData<QueryData>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          pets: page.pets.filter((pet) =>
            useFavoritesStore.getState().isMatched(pet.id)
          ),
        })),
      };
    });
  };

  const clearMatchesFromUI = () => {
    queryClient.setQueryData<QueryData>(queryKey, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          pets: page.pets.filter(
            (pet) => !useFavoritesStore.getState().isMatched(pet.id)
          ),
        })),
      };
    });
  };

  return {
    ...query,
    pets: query.data?.pages.flatMap((page) => page.pets) ?? [],
    totalFilteredCount,
    optimisticallyRemovePet,
    clearUnmatchedFromUI,
    clearMatchesFromUI,
  };
}
