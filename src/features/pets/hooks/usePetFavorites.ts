import { useFavoritesStore } from "@/stores/favorites";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useOptimisticUpdates } from "./useOptimisticUpdates";

export function usePetFavorites() {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isOnFavoritesPage = location.pathname === "/favorites";
  const isViewingMatches = searchParams.has("matches");
  const queryClient = useQueryClient();
  const { optimisticallyRemovePet } = useOptimisticUpdates();

  const toggleFavorite = (petId: string) => {
    if (isFavorite(petId)) {
      if (isOnFavoritesPage) {
        optimisticallyRemovePet(
          ["favorites", searchParams.toString(), isViewingMatches],
          petId
        );
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
