import { useRoutes } from "react-router-dom";
import { routeConfig } from "./config";

export function AppRoutes() {
  return useRoutes(routeConfig);
}
