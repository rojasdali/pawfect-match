import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    // TODO: Implement login logic
    console.log(data);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#818CF8]">
          Pawfect Match
        </h1>
        <p className="text-gray-300">
          Find your perfect furry friend! Tell us a bit about yourself to get
          started.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <input
            {...register("name")}
            type="text"
            placeholder="Your name"
            className={cn(
              "w-full px-4 py-2 bg-[#1E293B] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#818CF8]",
              errors.name && "border-red-500"
            )}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={cn(
              "w-full px-4 py-2 bg-[#1E293B] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#818CF8]",
              errors.email && "border-red-500"
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-[#818CF8] text-white rounded-lg hover:bg-[#6366F1] transition-colors disabled:opacity-50"
        >
          Start Finding Pets!
        </button>
      </form>
    </div>
  );
}
