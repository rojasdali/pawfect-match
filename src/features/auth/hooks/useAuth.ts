import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "@/stores/auth";

interface LoginData {
  name: string;
  email: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation<void, Error, LoginData>({
    mutationFn: authApi.login,
    onSuccess: (_, variables) => {
      setUser(variables);
      navigate("/dogs");
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        logout();
        navigate("/", { replace: true });
      }
    },
    onError: (error: Error) => {
      console.error("Logout error:", error.message);
      logout();
      navigate("/", { replace: true });
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error,
  };
}
