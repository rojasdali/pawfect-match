import { apiClient } from "@/lib/axios";
import { Pet } from "../types";

interface SearchParams {
  type: string;
  pageParam?: number | string;
  breed?: string;
  age?: number;
  zipCode?: string;
  sort?: string;
}

interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export const petsApi = {
  searchPets: async ({ type, pageParam = 0, ...params }: SearchParams) => {
    const { data } = await apiClient.get<SearchResponse>(`/${type}/search`, {
      params: {
        from: pageParam,
        sort: "breed:asc",
        ...params,
      },
    });
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
