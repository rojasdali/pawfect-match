import { apiClient } from "@/lib/axios";
import { Pet } from "../types";

interface SearchPetsResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export const petsApi = {
  searchPets: async ({
    type,
    pageParam = 0,
  }: {
    type: string;
    pageParam?: number | string;
  }) => {
    const { data } = await apiClient.get<SearchPetsResponse>(
      `/${type}/search`,
      {
        params: {
          from: pageParam,
          sort: "breed:asc",
        },
      }
    );
    return data;
  },

  getPetsByIds: async (type: string, ids: string[]): Promise<Pet[]> => {
    const { data } = await apiClient.post(`/${type}`, ids);
    return data;
  },

  toggleFavorite: async (type: string, id: string): Promise<void> => {
    await apiClient.post(`/${type}/${id}/favorite`);
  },
};
