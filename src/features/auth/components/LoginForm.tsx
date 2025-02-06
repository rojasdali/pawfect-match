import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={className}>
      <Button type="button" className="w-full" onClick={handleLogin}>
        Start Your Tail-Wagging Journey
      </Button>
    </div>
  );
}
