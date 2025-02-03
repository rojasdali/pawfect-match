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
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filterSchema, type Filters } from "../schemas/filters";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "react-router-dom";

interface FilterSheetProps {
  type: string;
  breeds: string[];
  isLoadingBreeds: boolean;
  onApplyFilters: (values: Filters) => void;
  onSheetOpen?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterSheet({
  type,
  isOpen,
  onOpenChange,
  onApplyFilters,
  breeds = [],
  isLoadingBreeds,
  onSheetOpen,
}: FilterSheetProps) {
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<Filters>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      minAge: searchParams.get("ageMin") ?? "",
      maxAge: searchParams.get("ageMax") ?? "",
      breed: searchParams.get("breed") ?? "all",
    },
  });

  // Reset form when sheet closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        minAge: searchParams.get("ageMin") ?? "",
        maxAge: searchParams.get("ageMax") ?? "",
        breed: searchParams.get("breed") ?? "all",
      });
      setInputValue("");
    }
  }, [isOpen, searchParams, form]);

  const filteredBreeds = useMemo(() => {
    if (!inputValue) return breeds;
    return breeds.filter((breed) =>
      breed.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [breeds, inputValue]);

  const handleSubmit = (values: Filters) => {
    onApplyFilters(values);
    onOpenChange(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (open && onSheetOpen) {
          onSheetOpen();
        }
        onOpenChange(open);
      }}
    >
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
                    <Popover
                      open={popoverOpen}
                      onOpenChange={setPopoverOpen}
                      modal={true}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value === "all" ? "All Breeds" : field.value}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 w-[--trigger-width]"
                        style={
                          {
                            "--trigger-width":
                              "var(--radix-popover-trigger-width)",
                          } as React.CSSProperties
                        }
                        align="start"
                      >
                        <div className="p-2 border-b">
                          <Input
                            placeholder="Search breeds..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoadingBreeds}
                          />
                        </div>
                        <div
                          className="overflow-y-auto touch-auto"
                          style={{
                            maxHeight: "calc(100vh - 200px)",
                            WebkitOverflowScrolling: "touch",
                          }}
                        >
                          <div className="p-2 space-y-1">
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                field.onChange("all");
                                setPopoverOpen(false);
                                setInputValue("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === "all"
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              All Breeds
                            </Button>
                            {filteredBreeds.map((breed) => (
                              <Button
                                key={breed}
                                type="button"
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                  field.onChange(breed);
                                  setPopoverOpen(false);
                                  setInputValue("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === breed
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {breed}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
