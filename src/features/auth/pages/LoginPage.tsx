import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PawPrint } from "lucide-react";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-[#1E293B]">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PawPrint className="h-8 w-8 text-[#818CF8]" />
            <h1 className="text-2xl font-bold text-[#818CF8]">Pawfect Match</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Find your perfect furry friend! Tell us a bit about yourself to get
            started.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    What's your name?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paw Parent"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    And email?
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="furever.friend@email.com"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#818CF8] hover:bg-[#818CF8]/90 text-white"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
