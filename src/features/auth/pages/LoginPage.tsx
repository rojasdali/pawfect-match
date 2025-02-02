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
  name: z.string().min(2, "Name must be at least 2 characters"),
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
    <Card className="w-full max-w-xl border-none dark:bg-[#1E293B] bg-white dark:text-white text-slate-900">
      <CardHeader className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-4">
          <PawPrint className="h-12 w-12 text-[#818CF8]" />
          <CardTitle className="text-4xl font-bold tracking-tight text-[#818CF8]">
            Pawfect Match
          </CardTitle>
          <PawPrint className="h-12 w-12 text-[#818CF8]" />
        </div>
        <CardDescription className="text-lg dark:text-[#F1F5F9] text-slate-600">
          Find your perfect furry friend! Tell us a bit about yourself to get
          started.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-[#F1F5F9] text-slate-700">
              What's your name?
            </label>
            <Input
              {...register("name")}
              type="text"
              placeholder="Your name"
              className={cn(
                "h-14 text-lg dark:bg-[#2D3B4F] bg-slate-50 dark:border-[#2D3B4F] border-slate-200",
                "dark:text-[#F1F5F9] text-slate-900",
                "dark:placeholder:text-[#94A3B8] placeholder:text-slate-500",
                errors.name && "border-red-500 dark:border-red-400"
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-[#F1F5F9] text-slate-700">
              What's your email?
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={cn(
                "h-14 text-lg dark:bg-[#2D3B4F] bg-slate-50 dark:border-[#2D3B4F] border-slate-200",
                "dark:text-[#F1F5F9] text-slate-900",
                "dark:placeholder:text-[#94A3B8] placeholder:text-slate-500",
                errors.email && "border-red-500 dark:border-red-400"
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-[#818CF8] hover:bg-[#818CF8]/90 text-[#F1F5F9] disabled:opacity-50"
          >
            Start Finding Pets!
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
