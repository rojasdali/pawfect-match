import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";

interface FavoriteItem {
  id: string;
  matched: boolean;
}

interface FavoritesState {
  favorites: Record<string, FavoriteItem[]>;
  isFavorite: (id: string) => boolean;
  isMatched: (id: string) => boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  setMatched: (id: string, matched: boolean) => void;
  clearFavorites: () => void;
  clearMatches: () => void;
  getFavoriteCount: () => number;
  getFavoriteIds: (options?: {
    shuffle?: boolean;
    excludeMatched?: boolean;
  }) => string[];
  getMatchedIds: () => string[];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},

      isFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return false;
        return (
          get().favorites[userEmail]?.some((fav) => fav.id === id) ?? false
        );
      },

      isMatched: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return false;
        return (
          get().favorites[userEmail]?.some(
            (fav) => fav.id === id && fav.matched
          ) ?? false
        );
      },

      addFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]: [
              ...(state.favorites[userEmail] || []),
              { id, matched: false },
            ],
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
              state.favorites[userEmail]?.filter((fav) => fav.id !== id) || [],
          },
        }));
      },

      setMatched: (id, matched) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]:
              state.favorites[userEmail]?.map((fav) =>
                fav.id === id ? { ...fav, matched } : fav
              ) || [],
          },
        }));
      },

      clearFavorites: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]:
              state.favorites[userEmail]?.filter((fav) => fav.matched) || [],
          },
        }));
      },

      clearMatches: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          favorites: {
            ...state.favorites,
            [userEmail]:
              state.favorites[userEmail]?.map((fav) => ({
                ...fav,
                matched: false,
              })) || [],
          },
        }));
      },

      getFavoriteCount: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return 0;
        return get().favorites[userEmail]?.length || 0;
      },

      getFavoriteIds: (options = {}) => {
        const userEmail = useAuthStore.getState().user?.email?.toLowerCase();
        if (!userEmail) return [];

        let favorites = get().favorites[userEmail] || [];

        if (options.excludeMatched) {
          favorites = favorites.filter((fav) => !fav.matched);
        }

        let ids = favorites.map((fav) => fav.id);

        // Shuffle if requested
        if (options.shuffle) {
          const shuffled = [...ids];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        }

        return ids;
      },

      getMatchedIds: () => {
        const userEmail = useAuthStore.getState().user?.email?.toLowerCase();
        if (!userEmail) return [];
        return (
          get()
            .favorites[userEmail]?.filter((fav) => fav.matched)
            .map((fav) => fav.id) || []
        );
      },
    }),
    {
      name: "favorites-storage",
      migrate: (persistedState: any) => {
        const migratedFavorites: Record<string, FavoriteItem[]> = {};

        if (persistedState && persistedState.favorites) {
          Object.entries(persistedState.favorites).forEach(
            ([email, favorites]) => {
              if (Array.isArray(favorites)) {
                if (
                  favorites.length === 0 ||
                  typeof favorites[0] === "string"
                ) {
                  migratedFavorites[email] = favorites.map((id: string) => ({
                    id,
                    matched: false,
                  }));
                } else {
                  migratedFavorites[email] = favorites;
                }
              }
            }
          );

          return {
            ...persistedState,
            favorites: migratedFavorites,
          };
        }

        return persistedState;
      },
      version: 1,
    }
  )
);
