import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/stores/favorites";
import { PetType } from "@/types/pet";

export function useMatch() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const favoriteIds = useFavoritesStore((state) => state.getFavoriteIds());

  const findMatch = async (type: PetType) => {
    if (favoriteIds.length < 2) return;

    setIsLoading(true);
    try {
      navigate(`/${type}/match`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    findMatch,
    isLoading,
  };
}
