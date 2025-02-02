interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 min-h-screen grid place-items-center dark:bg-[#0F172A] bg-[#F8FAFC]">
      {children}
    </div>
  );
}
