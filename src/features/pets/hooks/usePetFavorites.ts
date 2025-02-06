import { useFavoritesStore } from "@/stores/favorites";
import { useFavoritesQuery } from "./useFavoritesQuery";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function usePetFavorites() {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { optimisticallyRemovePet } = useFavoritesQuery();
  const location = useLocation();
  const isOnFavoritesPage = location.pathname === "/favorites";
  const queryClient = useQueryClient();

  const toggleFavorite = (petId: string) => {
    if (isFavorite(petId)) {
      if (isOnFavoritesPage) {
        optimisticallyRemovePet(petId);
        removeFavorite(petId);
        return;
      }
      removeFavorite(petId);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } else {
      addFavorite(petId);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  };

  return {
    toggleFavorite,
    isFavorite,
  };
}
