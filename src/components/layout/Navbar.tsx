import { useAuthStore } from "@/stores/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut, Moon, PawPrint, Sun, User, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useFavoritesStore } from "@/stores/favorites";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchStateNavigation } from "@/hooks/useSearchStateNavigation";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const favoriteCount = useFavoritesStore((state) => state.getFavoriteCount());
  const matchedCount = useFavoritesStore(
    (state) => state.getMatchedIds().length
  );
  const hasFavorites = favoriteCount > 0;
  const hasMatches = matchedCount > 0;
  const { navigatePreservingSearch, navigateBack } = useSearchStateNavigation();

  const handleHomeClick = () => {
    navigateBack();
  };

  const handleMatchesClick = () => {
    navigatePreservingSearch("/favorites?matches=true", { replace: true });
  };

  const handleFavoritesClick = () => {
    navigatePreservingSearch("/favorites");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container flex h-14 items-center">
        <button
          onClick={handleHomeClick}
          className="flex gap-2 items-center mr-4 hover:opacity-90 transition-opacity"
        >
          <PawPrint className="h-6 w-6 text-[#818CF8]" />
          <span className="font-semibold text-lg text-[#818CF8]">
            Pawfect Match
          </span>
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoritesClick}
                  className="relative h-10 w-10"
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-colors",
                      hasFavorites && "fill-red-500 text-red-500"
                    )}
                  />
                  {hasFavorites && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#818CF8] text-xs font-semibold text-white flex items-center justify-center shadow-[0_0_4px_rgba(129,140,248,0.5)] ring-2 ring-white dark:ring-background">
                      {favoriteCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>See your favorite pets!</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {hasMatches && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMatchesClick}
                    className="relative h-10 w-10"
                  >
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 text-xs font-semibold text-white flex items-center justify-center shadow-[0_0_4px_rgba(255,215,0,0.5)] ring-2 ring-white dark:ring-background">
                      {matchedCount}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>See your matched pets!</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-4 h-10 hover:bg-accent dark:hover:bg-gray-700/50"
                >
                  <User className="h-6 w-6 text-muted-foreground dark:text-gray-100" />
                  <span className="capitalize text-base">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
