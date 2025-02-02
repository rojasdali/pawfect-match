import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/features/auth/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: User) => {
        if (!user.name || !user.email) {
          console.error("Invalid user data:", user);
          return;
        }
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
