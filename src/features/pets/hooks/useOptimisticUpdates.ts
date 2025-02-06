import { useQueryClient } from "@tanstack/react-query";
import { type Pet } from "../types";

interface QueryData {
  pages: Array<{
    pets: Pet[];
    nextCursor?: string;
    totalFilteredCount: number;
  }>;
}

export function useOptimisticUpdates() {
  const queryClient = useQueryClient();

  const optimisticallyRemovePet = (queryKey: unknown[], petId: string) => {
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

  return { optimisticallyRemovePet };
}
