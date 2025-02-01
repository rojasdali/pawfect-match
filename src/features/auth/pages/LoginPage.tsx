import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    login(data);
  };

  return (
    <Card className="border-none bg-transparent shadow-none text-center w-full max-w-xl">
      <CardHeader className="space-y-4">
        <CardTitle className="text-5xl font-bold tracking-tight text-[#818CF8] flex items-center justify-center gap-4">
          <PawPrint className="size-12" />
          Pawfect Match
          <PawPrint className="size-12" />
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          Find your perfect furry friend! Tell us a bit about yourself to get
          started.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        {error && (
          <p className="text-red-500 mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input
              {...register("name")}
              type="text"
              placeholder="Your name"
              className={cn(
                "bg-[#1E293B] border-[#1E293B] h-14 text-xl text-white placeholder:text-gray-400",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={cn(
                "bg-[#1E293B] border-[#1E293B] h-14 text-xl text-white placeholder:text-gray-400",
                errors.email && "border-red-500"
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#818CF8] hover:bg-[#6366F1] h-12 text-lg"
          >
            {isLoading ? "Logging in..." : "Start Finding Pets!"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
