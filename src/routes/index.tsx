import { Routes, Route } from "react-router-dom";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
