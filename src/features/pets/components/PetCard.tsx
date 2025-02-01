import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

// Rename from DogCard to PetCard and update props
interface PetCardProps {
  name: string;
  breed: string;
  age: number;
  img: string;
  type: "dog" | "cat" | "other"; // Add type for future pet types
  isFavorite?: boolean;
  onFavorite?: () => void;
}

export function PetCard({
  name,
  breed,
  age,
  img,
  type,
  isFavorite,
  onFavorite,
}: PetCardProps) {
  return (
    <Card className="group shadow-sm hover:shadow-md dark:shadow-none bg-[#F1F5F9] dark:bg-card p-3">
      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
        <img
          src={img}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 dark:bg-background/80 backdrop-blur-sm hover:bg-white dark:hover:bg-background/90 group/heart shadow-sm"
          onClick={onFavorite}
        >
          {isFavorite ? (
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-5 w-5 text-gray-500 transition-colors group-hover/heart:fill-red-500 group-hover/heart:text-red-500" />
          )}
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-foreground capitalize">
          {name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {type.charAt(0).toUpperCase() + type.slice(1)} • {breed}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {age} {age === 1 ? "year" : "years"} old
        </p>
      </CardContent>
    </Card>
  );
}
