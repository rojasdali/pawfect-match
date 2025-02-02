import axios from "axios";
import { API } from "@/config/api";
import { useAuthStore } from "@/stores/auth";

export const apiClient = axios.create({
  baseURL: API.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      return Promise.reject(new Error("Session expired. Please login again."));
    }

    if (status === 403) {
      return Promise.reject(new Error("You don't have permission to do this."));
    }

    if (status === 404) {
      return Promise.reject(new Error("Resource not found."));
    }

    if (status >= 500) {
      return Promise.reject(
        new Error("Something went wrong. Please try again later.")
      );
    }

    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);
