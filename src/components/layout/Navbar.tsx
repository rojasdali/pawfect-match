import { useAuthStore } from "@/stores/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut, Moon, PawPrint, Sun, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useNavigate } from "react-router-dom";
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
import { ROUTES } from "@/config/routes";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const favoriteCount = useFavoritesStore((state) => state.getFavoriteCount());
  const hasFavorites = favoriteCount > 0;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container flex h-14 items-center">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="flex gap-2 items-center mr-4 hover:opacity-80 transition-opacity"
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
                  onClick={() => navigate("/favorites")}
                  className="relative"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      hasFavorites && "fill-red-500 text-red-500"
                    )}
                  />
                  {hasFavorites && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#818CF8] text-[11px] font-semibold text-white flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-background">
                      {favoriteCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>See your favorite pets!</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 hover:bg-white/10"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="capitalize text-sm">{user.name}</span>
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
