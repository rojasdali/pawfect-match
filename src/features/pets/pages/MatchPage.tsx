import { useEffect, useState, useCallback } from "react";
import { PetCard } from "../components/PetCard";
import { useNavigate, Navigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { useFavoritesStore } from "@/stores/favorites";
import { type Pet } from "@/types/pet";
import { petsApi } from "../api/pets";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function MatchPage() {
  const navigate = useNavigate();
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const favoriteIds = useFavoritesStore((state) => state.getFavoriteIds());

  // Redirect if not enough favorites
  if (favoriteIds.length < 2) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Memoize the loadFavorites function
  const loadFavoritesAndFindMatch = useCallback(async () => {
    try {
      const pets = await petsApi.getPetsByIds("dogs", favoriteIds);
      setFavorites(pets);

      // Randomly select a match
      const randomIndex = Math.floor(Math.random() * pets.length);
      setMatchedPet(pets[randomIndex]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setIsLoading(false);
    }
  }, [favoriteIds.join(",")]); // Only recreate if favoriteIds change

  useEffect(() => {
    loadFavoritesAndFindMatch();
  }, [loadFavoritesAndFindMatch]);

  useEffect(() => {
    if (isLoading || !favorites.length || showMatch) return;

    // Shuffle through favorites before showing match
    const interval = setInterval(() => {
      setCurrentPetIndex((prev) => (prev + 1) % favorites.length);
    }, 150); // Speed of shuffling

    // Show the match after 3 seconds
    const timeout = setTimeout(() => {
      setShowMatch(true);

      // Trigger a few celebratory stars
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
          // Left side
          fire(0.25, {
            origin: { x: randomInRange(0.2, 0.3), y: 0.5 },
          });
          // Right side
          fire(0.25, {
            origin: { x: randomInRange(0.7, 0.8), y: 0.5 },
          });
        }, i * 750); // Stagger the bursts
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [favorites.length, isLoading, showMatch]);

  const BackButton = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(ROUTES.HOME)}
      className="gap-2 mt-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Find more furry friends!
    </Button>
  );

  if (isLoading || !matchedPet) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container">
          <BackButton />
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
        <BackButton />
      </div>

      <main className="container py-2">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            {showMatch ? "Your Pawfect Match!" : "Finding your match..."}
          </h1>
          {showMatch ? (
            <PetCard {...matchedPet} />
          ) : (
            favorites.length > 0 && <PetCard {...favorites[currentPetIndex]} />
          )}
        </div>
      </main>
    </div>
  );
}
