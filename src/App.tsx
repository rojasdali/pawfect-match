import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { routes } from "./routes/routes";
import { TooltipProvider } from "@/providers/TooltipProvider";

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
