import { useParams, useSearchParams } from "react-router-dom";
import { petsApi } from "../api/pets";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNearbyLocations } from "./useNearbyLocations";

export function usePetSearch() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const [searchParams] = useSearchParams();
  const nearbyLocations = useNearbyLocations();

  const isDistanceFilterActive = searchParams.has("distance");

  const queryKey = ["pets", type, searchParams.toString()];
  const queryFn = async ({ pageParam = "0" }) => {
    let zipCodes: string[] | undefined;
    if (isDistanceFilterActive) {
      const result = await nearbyLocations.refetch();
      zipCodes = result.data;
    }

    const searchResult = await petsApi.searchPets({
      type,
      pageParam,
      sort: searchParams.get("sort") || "breed:asc",
      breeds: searchParams.get("breed")
        ? [searchParams.get("breed")!]
        : undefined,
      ageMin: searchParams.get("ageMin")
        ? Number(searchParams.get("ageMin"))
        : undefined,
      ageMax: searchParams.get("ageMax")
        ? Number(searchParams.get("ageMax"))
        : undefined,
      zipCodes,
    });

    const pets = await petsApi.getPetsByIds(type, searchResult.resultIds);
    return {
      pets,
      nextCursor: searchResult.next
        ? String(Number(pageParam) + 25)
        : undefined,
    };
  };

  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    enabled: true,
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
