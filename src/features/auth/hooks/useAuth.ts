import { useAuthStore } from "@/stores/auth";
import { authApi } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setUser(user);
      const returnTo = location.state?.from || ROUTES.HOME;
      navigate(returnTo);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      navigate(ROUTES.LOGIN, {
        state: { from: location.pathname + location.search },
      });
    },
    onError: (error) => {
      console.error("Logout failed, but continuing anyway:", error);
      clearUser();
      queryClient.clear();
      navigate(ROUTES.LOGIN, {
        state: { from: location.pathname + location.search },
      });
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error,
  };
}
