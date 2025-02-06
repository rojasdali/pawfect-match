import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t shadow-[0_-1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_-1px_3px_rgba(0,0,0,0.2)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center gap-2 py-4">
        <div className="text-sm text-muted-foreground">
          © 2025 Pawfect Match. All rights reserved.
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://w85exp.miamidade.gov/AnimalPaymentsWeb/startPaymentF.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span>Pawsitively change a life - Donate today!</span>
          </a>

          <span className="hidden sm:inline text-muted-foreground/50">•</span>

          <a
            href="https://github.com/rojasdali"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
