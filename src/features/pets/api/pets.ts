import { apiClient } from "@/lib/axios";
import { Pet } from "../types";

interface SearchParams {
  type: string;
  pageParam?: number | string;
  breeds?: string[];
  ageMin?: number;
  ageMax?: number;
  zipCode?: string;
  sort?: string;
}

interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

const BATCH_SIZE = 25;

export const petsApi = {
  searchPets: async ({ type, pageParam = 0, ...params }: SearchParams) => {
    const { data } = await apiClient.get<SearchResponse>(`/${type}/search`, {
      params: {
        from: pageParam,
        size: BATCH_SIZE,
        sort: "breed:asc",
        ...params,
      },
    });
    return data;
  },

  getPetsByIds: async (type: string, ids: string[]): Promise<Pet[]> => {
    if (ids.length > BATCH_SIZE) {
      const batches = [];
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batchIds = ids.slice(i, i + BATCH_SIZE);
        batches.push(batchIds);
      }

      const batchResults = await Promise.all(
        batches.map((batchIds) => apiClient.post(`/${type}`, batchIds))
      );

      return batchResults.flatMap((response) => response.data);
    }

    const { data } = await apiClient.post(`/${type}`, ids);
    return data;
  },

  getBreeds: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>("/dogs/breeds");
    return data;
  },
};
