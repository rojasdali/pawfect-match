import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./auth";

interface MatchesState {
  matches: Record<string, string[]>;
  isMatch: (id: string) => boolean;
  addMatch: (id: string) => void;
  removeMatch: (id: string) => void;
  clearMatches: () => void;
  getMatchCount: () => number;
  getMatchIds: () => string[];
}

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set, get) => ({
      matches: {},
      isMatch: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return false;
        return get().matches[userEmail]?.includes(id) ?? false;
      },
      addMatch: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          matches: {
            ...state.matches,
            [userEmail]: [...(state.matches[userEmail] || []), id],
          },
        }));
      },
      removeMatch: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          matches: {
            ...state.matches,
            [userEmail]:
              state.matches[userEmail]?.filter((matchId) => matchId !== id) ||
              [],
          },
        }));
      },
      clearMatches: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => ({
          matches: {
            ...state.matches,
            [userEmail]: [],
          },
        }));
      },
      getMatchCount: () => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return 0;
        return get().matches[userEmail]?.length || 0;
      },
      getMatchIds: () => {
        const userEmail = useAuthStore.getState().user?.email?.toLowerCase();
        return userEmail ? get().matches[userEmail] || [] : [];
      },
    }),
    {
      name: "matches-storage",
    }
  )
);
