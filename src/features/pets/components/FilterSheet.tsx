import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filterSchema, type Filters } from "../schemas/filters";

interface FilterSheetProps {
  type: string;
  breeds: string[];
  isLoadingBreeds: boolean;
  defaultValues: Filters;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (values: Filters) => void;
  onResetFilters: () => void;
}

export function FilterSheet({
  type,
  isOpen,
  onOpenChange,
  onApplyFilters,
  defaultValues,
  breeds = [],
  isLoadingBreeds,
}: FilterSheetProps) {
  const form = useForm<Filters>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  const handleSubmit = (values: Filters) => {
    onApplyFilters(values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:size-auto lg:px-4 lg:py-2"
        >
          <SlidersHorizontal className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">Filters</span>
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              <span className="capitalize">Filter {type}</span>
            </SheetTitle>
            <SheetDescription>
              Adjust filters to find your pawfect companion
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-6 space-y-6"
            >
              <div className="space-y-4">
                <FormLabel>Age Range (years)</FormLabel>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="minAge"
                    render={({ field }) => (
                      <FormItem className="min-h-[70px]">
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Min"
                            className="w-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground self-start mt-2">
                    to
                  </span>
                  <FormField
                    control={form.control}
                    name="maxAge"
                    render={({ field }) => (
                      <FormItem className="min-h-[70px]">
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Max"
                            className="w-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <Select
                      disabled={isLoadingBreeds}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">All Breeds</SelectItem>
                        {breeds.map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="soft-reset"
                  className="w-full"
                  onClick={() => {
                    form.reset({
                      minAge: "",
                      maxAge: "",
                      breed: "all",
                    });
                  }}
                >
                  Reset Filters
                </Button>
                <SheetClose asChild>
                  <Button type="submit" variant="default" className="w-full">
                    Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
