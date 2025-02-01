import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <Outlet />
      </div>
    </div>
  );
}
