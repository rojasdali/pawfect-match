import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";

interface FavoritesState {
  favorites: Record<string, string[]>;
  isFavorite: (id: string) => boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      isFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return false;
        return get().favorites[userEmail]?.includes(id) ?? false;
      },
      addFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]: [...(state.favorites[userEmail] || []), id],
          },
        }));
      },
      removeFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]:
              state.favorites[userEmail]?.filter((favId) => favId !== id) || [],
          },
        }));
      },
      clearFavorites: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]: [],
          },
        }));
      },
      getFavoriteCount: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return 0;
        return get().favorites[userEmail]?.length || 0;
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);
