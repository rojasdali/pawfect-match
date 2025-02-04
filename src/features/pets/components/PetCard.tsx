import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";
import { PetCardProps } from "../types";
import { usePetFavorites } from "@/features/pets/hooks/usePetFavorites";
import { cn } from "@/lib/utils";

export function PetCard({ id, name, breed, age, img, zip_code }: PetCardProps) {
  const { toggleFavorite, isFavorite } = usePetFavorites();
  const favorite = isFavorite(id);

  const handleFavorite = () => {
    toggleFavorite(id);
  };

  return (
    <Card
      tabIndex={0}
      className="group relative overflow-hidden hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${name}, ${breed}, ${age} years old`}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={img}
          alt={`${name} the ${breed}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite();
          }}
          aria-label={
            favorite
              ? `Remove ${name} from favorites`
              : `Add ${name} to favorites`
          }
          className="absolute top-2 right-2 bg-white/90 dark:bg-background/80 backdrop-blur-sm hover:bg-white dark:hover:bg-background/90 shadow-sm h-8 w-8 group/heart"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              favorite
                ? "fill-red-500 text-red-500"
                : "text-gray-500 group-hover/heart:fill-red-500 group-hover/heart:text-red-500"
            )}
          />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="text-lg dark:text-white">{name}</CardTitle>
        <CardDescription className="dark:text-gray-200">
          {breed}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground dark:text-gray-200">
          {age} years old
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-200">
          <MapPin className="h-4 w-4" />
          <span>{zip_code}</span>
        </div>
      </CardContent>
    </Card>
  );
}
