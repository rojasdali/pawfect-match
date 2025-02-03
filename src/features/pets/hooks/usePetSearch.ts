import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { petsApi } from "../api/pets";

export function usePetSearch() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const [searchParams] = useSearchParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["pets", type, searchParams.toString()],
    queryFn: async ({ pageParam = "0" }) => {
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
      });

      const pets = await petsApi.getPetsByIds(type, searchResult.resultIds);

      let nextCursor: string | undefined;
      if (searchResult.next) {
        try {
          const nextUrl = new URL(searchResult.next);
          nextCursor = nextUrl.searchParams.get("from") || undefined;
        } catch (e) {
          nextCursor = String(Number(pageParam) + 25);
        }
      }

      return {
        pets,
        nextCursor,
        total: searchResult.total,
      };
    },
    initialPageParam: "0",
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor) return undefined;
      if (Number(lastPage.nextCursor) >= lastPage.total) return undefined;
      return lastPage.nextCursor;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });

  const allPets = data?.pages.flatMap((page) => page.pets) ?? [];

  return {
    allPets,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  };
}
