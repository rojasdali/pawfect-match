import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
