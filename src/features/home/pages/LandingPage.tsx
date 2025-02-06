import { PawPrint, Heart, Search, Star, Moon, Sun } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/stores/auth";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 lg:py-24 min-h-[calc(100vh-2rem)]">
        <div className="flex justify-center lg:justify-start mb-12">
          <div className="flex items-center gap-4">
            <PawPrint className="h-12 w-12 lg:h-16 lg:w-16 text-[#818CF8]" />
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Find Your
                <br />
                Pawfect Match
              </h1>
              <p className="text-xl text-muted-foreground">
                Where Furry Friends Find Their Furever Homes
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
          <div className="flex-1 w-full max-w-md lg:max-w-none grid gap-8 lg:grid-cols-3 order-2 lg:order-1">
            <Card className="p-8 space-y-4 text-center">
              <Search className="h-8 w-8 mx-auto text-[#818CF8]" />
              <h3 className="font-semibold">Browse Pets</h3>
              <p className="text-sm text-muted-foreground">
                Explore our adorable collection of furry friends waiting for a
                home
              </p>
            </Card>

            <Card className="p-8 space-y-4 text-center">
              <Heart className="h-8 w-8 mx-auto text-red-500" />
              <h3 className="font-semibold">Pick Favorites</h3>
              <p className="text-sm text-muted-foreground">
                Save the pets that make your heart skip a beat
              </p>
            </Card>

            <Card className="p-8 space-y-4 text-center">
              <Star className="h-8 w-8 mx-auto text-yellow-500" />
              <h3 className="font-semibold">Find Your Match</h3>
              <p className="text-sm text-muted-foreground">
                Let us help you find your pawfect companion
              </p>
            </Card>
          </div>

          <Card className="w-full max-w-md lg:w-[400px] p-8 pb-16 flex flex-col justify-center lg:my-[-2rem] order-1 lg:order-2">
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Welcome!</h2>
                <p className="text-sm text-muted-foreground">
                  Ready to meet your new best friend?
                </p>
              </div>
              <LoginForm />
            </div>
          </Card>
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-md hover:shadow-lg"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
