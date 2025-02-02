import { apiClient } from "@/lib/axios";
import { LoginData, User } from "../types";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authApi = {
  login: async (credentials: LoginData): Promise<User> => {
    try {
      const response = await apiClient.post("/auth/login", {
        name: credentials.name.trim(),
        email: credentials.email.trim().toLowerCase(),
      });

      if (response.status !== 200) {
        throw new AuthError("Login failed. Please try again.");
      }

      return credentials;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AuthError("Invalid credentials");
      }
      if (error.response?.status === 403) {
        throw new AuthError("Access denied");
      }
      throw new AuthError("Failed to login. Please try again.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed, but continuing anyway:", error);
    }
  },
};
