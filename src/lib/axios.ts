import axios from "axios";
import { API } from "@/config/api";

export const apiClient = axios.create({
  baseURL: API.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
