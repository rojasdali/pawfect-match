import { useFavoritesStore } from "@/stores/favorites";
import { useFavoritesQuery } from "./useFavoritesQuery";
import { useLocation } from "react-router-dom";

export function usePetFavorites() {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { removePet } = useFavoritesQuery();
  const location = useLocation();
  const isOnFavoritesPage = location.pathname === "/favorites";

  const toggleFavorite = (petId: string) => {
    if (isFavorite(petId)) {
      removeFavorite(petId);

      if (isOnFavoritesPage) {
        removePet(petId);
      }
    } else {
      addFavorite(petId);
    }
  };

  return {
    toggleFavorite,
    isFavorite,
  };
}
