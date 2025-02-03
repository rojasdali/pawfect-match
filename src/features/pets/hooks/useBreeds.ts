import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../api/pets";

interface UseBreedsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

export function useBreeds({
  enabled = false,
  staleTime = Infinity,
  gcTime = 1000 * 60 * 30,
  refetchOnMount = false,
  refetchOnWindowFocus = false,
}: UseBreedsOptions = {}) {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: () => petsApi.getBreeds(),
    enabled,
    staleTime,
    gcTime,
    refetchOnMount,
    refetchOnWindowFocus,
  });
}
