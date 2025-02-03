import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../api/pets";

interface UseBreedsOptions {
  enabled?: boolean;
}

export function useBreeds({ enabled = true }: UseBreedsOptions = {}) {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: () => petsApi.getBreeds(),
    enabled,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
