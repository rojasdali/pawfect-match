import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star } from "lucide-react";
import { PetCardProps } from "@/features/pets/types/index";
import { useFavoritesStore } from "@/stores/favorites";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useFavoritesQuery } from "@/features/pets/hooks/useFavoritesQuery";

function formatAge(age: number): string {
  if (age === 0) return "< 1 year";
  if (age === 1) return "1 year old";
  return `${age} years old`;
}

export function PetCard({ id, name, breed, age, img, zip_code }: PetCardProps) {
  const location = useLocation();
  const isMatchPage = location.pathname.includes("/match");
  const isViewingMatches =
    location.pathname === "/favorites" &&
    location.search.includes("matches=true");
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));
  const isMatched = useFavoritesStore((state) => state.isMatched(id));
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const setMatched = useFavoritesStore((state) => state.setMatched);

  const { optimisticallyRemovePet } = useFavoritesQuery();

  const handleAction = () => {
    if (isMatched) {
      setMatched(id, false);
      if (isViewingMatches) {
        optimisticallyRemovePet(id);
      }
    } else if (isFavorite) {
      if (location.pathname === "/favorites") {
        optimisticallyRemovePet(id);
      }
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const displayAge = formatAge(age);

  return (
    <Card
      tabIndex={0}
      className={cn(
        "group relative overflow-hidden hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isMatchPage && "max-w-lg mx-auto"
      )}
      aria-label={`${name}, ${breed}, ${age} years old`}
    >
      <div
        className={cn(
          "overflow-hidden relative",
          isMatchPage ? "aspect-[4/3]" : "aspect-square"
        )}
      >
        <img
          src={img}
          alt={`${name} the ${breed}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3
            className={cn(
              "font-bold text-white mb-2",
              isMatchPage ? "text-3xl" : "text-2xl"
            )}
          >
            {name}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 dark:bg-background/80 backdrop-blur-sm text-gray-800 dark:text-gray-200">
            {breed}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleAction();
          }}
          aria-label={
            isMatched
              ? `Remove ${name} from matches`
              : isFavorite
              ? `Remove ${name} from favorites`
              : `Add ${name} to favorites`
          }
          className="absolute top-2 right-2 bg-white/90 dark:bg-background/80 backdrop-blur-sm hover:bg-white dark:hover:bg-background/90 shadow-sm h-8 w-8 group/action"
        >
          {isMatched ? (
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                "fill-yellow-400 text-yellow-400"
              )}
            />
          ) : (
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 group-hover/action:fill-red-500 group-hover/action:text-red-500"
              )}
            />
          )}
        </Button>
      </div>
      <CardContent className={cn("pt-4", isMatchPage && "pb-6")}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground dark:text-gray-200">
            {displayAge}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-200">
            <MapPin className="h-4 w-4" />
            <span>{zip_code}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
