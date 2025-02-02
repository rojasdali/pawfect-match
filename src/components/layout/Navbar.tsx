import { useAuthStore } from "@/stores/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut, Moon, PawPrint, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-[#94A3B8] dark:bg-[#0B1120] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <button
          onClick={() => navigate("/dogs")}
          className="flex gap-2 items-center mr-4 hover:opacity-80 transition-opacity"
        >
          <PawPrint className="h-6 w-6 text-[#818CF8]" />
          <span className="font-semibold text-lg text-foreground">
            Pawfect Match
          </span>
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
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
                  className="flex items-center gap-2 text-red-600 dark:text-red-400"
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
