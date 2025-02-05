import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../api/pets";

export function useBreeds(enabled: boolean = true) {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: petsApi.getBreeds,
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
}
