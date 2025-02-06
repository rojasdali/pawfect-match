import { Outlet, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useFavoritesStore } from "@/stores/favorites";
import { useMatch } from "@/features/pets/hooks/useMatch";
import { PetType } from "@/types/pet";

export function MainLayout() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const { findMatch, isLoading } = useMatch();
  const favoriteCount = useFavoritesStore((state) => state.getFavoriteCount());
  const hasEnoughFavorites = favoriteCount >= 2;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-2 flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButton
        onClick={() => findMatch(type as PetType)}
        disabled={!hasEnoughFavorites}
        isLoading={isLoading}
        className="animate-in fade-in slide-in-from-bottom-6 duration-500"
      />
    </div>
  );
}
