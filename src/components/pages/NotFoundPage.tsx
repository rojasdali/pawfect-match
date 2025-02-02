import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="text-9xl mb-4">🐶</div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-[#818CF8] flex items-center justify-center gap-4">
            <PawPrint className="h-12 w-12" />
            Ruh Roh!
            <PawPrint className="h-12 w-12" />
          </h1>
          <p className="text-xl text-muted-foreground">
            Looks like you're barking up the wrong tree!
          </p>
        </div>
        <Button
          onClick={() => navigate("/dogs")}
          className="bg-[#818CF8] hover:bg-[#818CF8]/90 text-white"
          size="lg"
        >
          Fetch Me Home
        </Button>
      </div>
    </div>
  );
}
