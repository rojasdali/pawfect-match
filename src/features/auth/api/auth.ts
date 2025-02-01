import { apiClient } from "@/lib/axios";
import type { AxiosError } from "axios";

interface LoginData {
  name: string;
  email: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export const authApi = {
  login: async (data: LoginData) => {
    try {
      const response = await apiClient.post("/auth/login", {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response?.status === 403) {
          throw new Error(
            "Invalid credentials. Please check your name and email."
          );
        }
        if (axiosError.response) {
          throw new Error(axiosError.response.data.message || "Login failed");
        }
        if (axiosError.request) {
          throw new Error("Network error - no response received");
        }
      }
      throw new Error("An unexpected error occurred");
    }
  },
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      if (error instanceof Error) {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response) {
          throw new Error(axiosError.response.data.message || "Logout failed");
        }
        if (axiosError.request) {
          throw new Error("Network error - no response received");
        }
      }
      throw new Error("An unexpected error occurred");
    }
  },
};
