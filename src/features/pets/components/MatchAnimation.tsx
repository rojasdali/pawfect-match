import { useEffect, useState } from "react";
import { PetCard } from "./PetCard";
import { type Pet } from "@/types/pet";

interface MatchAnimationProps {
  pets: Pet[];
  onAnimationComplete: () => void;
}

export function MatchAnimation({
  pets,
  onAnimationComplete,
}: MatchAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (pets.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pets.length);
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onAnimationComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pets.length, onAnimationComplete]);

  if (pets.length === 0) return null;

  return <PetCard {...pets[currentIndex]} />;
}
