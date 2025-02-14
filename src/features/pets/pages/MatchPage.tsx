import { useEffect, useState, useCallback, useMemo } from "react";
import { PetCard } from "../components/PetCard";
import { Navigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { useFavoritesStore } from "@/stores/favorites";
import { type Pet } from "@/types/pet";
import { petsApi } from "../api/pets";
import { MatchAnimation } from "../components/MatchAnimation";
import { useSearchStateNavigation } from "@/hooks/useSearchStateNavigation";
import { useQueryClient } from "@tanstack/react-query";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function MatchPage() {
  const location = useLocation();
  const [showMatch, setShowMatch] = useState(false);
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { navigateBack } = useSearchStateNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    setShowMatch(false);
    setMatchedPet(null);
    setIsLoading(true);
  }, [location.state?.key]);

  const favoriteIds = useMemo(
    () =>
      useFavoritesStore.getState().getFavoriteIds({
        shuffle: true,
        excludeMatched: true,
      }),
    [location.state?.key]
  );

  // Redirect if not enough unmatched favorites
  if (favoriteIds.length < 2) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const loadFavoritesAndFindMatch = useCallback(async () => {
    try {
      const pets = await petsApi.getPetsByIds("dogs", favoriteIds);
      setFavorites(pets);

      const randomIndex = Math.floor(Math.random() * pets.length);
      const selectedPet = pets[randomIndex];
      setMatchedPet(selectedPet);

      // Refetch favorites after finding a match
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setIsLoading(false);
    }
  }, [favoriteIds]);

  useEffect(() => {
    loadFavoritesAndFindMatch();
  }, [loadFavoritesAndFindMatch]);

  const handleAnimationComplete = useCallback(() => {
    setShowMatch(true);
    if (matchedPet) {
      useFavoritesStore.getState().setMatched(matchedPet.id, true);
      const count = 3;
      const defaults = {
        spread: 120,
        ticks: 50,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 15,
        shapes: ["star"] satisfies confetti.Shape[],
        colors: ["#FFE400", "#FFBD00", "#E89400"],
        scalar: 2,
      };
      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(8 * particleRatio),
        });
      }
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          fire(0.25, {
            origin: { x: randomInRange(0.2, 0.3), y: 0.5 },
          });
          fire(0.25, {
            origin: { x: randomInRange(0.7, 0.8), y: 0.5 },
          });
        }, i * 750);
      }
    }
  }, [matchedPet]);

  const handleBack = () => {
    navigateBack();
  };

  if (isLoading || !matchedPet) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Find more furry friends!
          </Button>
        </div>
        <main className="container py-2">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">
              Finding your match...
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Find more furry friends!
        </Button>
      </div>

      <main className="container py-2">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            {showMatch ? "Your Pawfect Match!" : "Finding your match..."}
          </h1>
          {showMatch ? (
            <PetCard {...matchedPet} />
          ) : (
            <MatchAnimation
              pets={favorites}
              onAnimationComplete={handleAnimationComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
