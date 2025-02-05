import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../api/pets";

interface UseBreedsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useBreeds(options: UseBreedsOptions = {}) {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: () => petsApi.getBreeds(),
    ...options,
  });
}
