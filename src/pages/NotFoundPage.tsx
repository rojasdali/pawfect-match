import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { useSearchStateNavigation } from "@/hooks/useSearchStateNavigation";

export function NotFoundPage() {
  const { navigateBack } = useSearchStateNavigation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PawPrint className="h-12 w-12 text-[#818CF8]" />
          <h1 className="text-4xl font-bold text-[#818CF8]">404</h1>
        </div>
        <p className="text-xl mb-8">Oops! This page has run away...</p>
        <Button
          onClick={navigateBack}
          className="bg-[#818CF8] text-white hover:bg-[#818CF8]/90"
        >
          Fetch Me Home
        </Button>
      </div>
    </div>
  );
}
