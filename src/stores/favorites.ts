import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
  getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
        })),
      clearFavorites: () => set({ favorites: [] }),
      isFavorite: (id) => get().favorites.includes(id),
      getFavoriteCount: () => get().favorites.length,
    }),
    {
      name: "favorites-storage",
    }
  )
);
