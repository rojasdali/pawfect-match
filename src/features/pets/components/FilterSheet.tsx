import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filterSchema, type Filters } from "../schemas/filters";
import { useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { SearchPopover } from "./search/SearchPopover";
import { LocationSearchInput } from "./search/LocationSearchInput";

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

  const form = useForm<Filters>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      minAge: searchParams.get("ageMin") ?? "",
      maxAge: searchParams.get("ageMax") ?? "",
      breed: searchParams.get("breed") ?? "all",
      distance: searchParams.get("distance")
        ? Number(searchParams.get("distance"))
        : null,
      location: null,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      const locationParam = searchParams.get("location");
      let location = null;
      if (locationParam) {
        try {
          location = JSON.parse(locationParam);
        } catch (e) {
          console.error("Failed to parse location from URL", e);
        }
      }

      form.reset({
        minAge: searchParams.get("ageMin") ?? "",
        maxAge: searchParams.get("ageMax") ?? "",
        breed: searchParams.get("breed") ?? "all",
        distance: searchParams.get("distance")
          ? Number(searchParams.get("distance"))
          : null,
        location,
      });
    }
  }, [isOpen, searchParams, form]);

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
        <SheetContent
          side="left"
          className="w-full flex flex-col p-0 gap-0 sm:max-w-md"
        >
          <div className="px-4 py-2 sm:p-6 border-b">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-xl">
                <span className="capitalize">Filter {type}</span>
              </SheetTitle>
              <SheetDescription className="text-sm">
                Adjust filters to find your pawfect companion
              </SheetDescription>
            </SheetHeader>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2 sm:p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-base">Breed</FormLabel>
                        <SearchPopover
                          options={breeds}
                          value={field.value}
                          onChange={field.onChange}
                          isLoading={isLoadingBreeds}
                          placeholder="Select a breed"
                          searchPlaceholder="Search breeds..."
                          allOptionText="All Breeds"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-1.5">
                    <FormLabel className="text-base">
                      Age Range (years)
                    </FormLabel>
                    <div className="flex items-center gap-3">
                      <FormField
                        control={form.control}
                        name="minAge"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="Min"
                                className="w-full h-9 text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <FormField
                        control={form.control}
                        name="maxAge"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="Max"
                                className="w-full h-9 text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Location</FormLabel>
                          <FormDescription className="text-xs">
                            Search by city or zip code
                          </FormDescription>
                          <div className="flex flex-col gap-1">
                            <LocationSearchInput
                              value={field.value}
                              onChange={(location) => {
                                field.onChange(location);
                                if (location) {
                                  form.setValue("distance", 25);
                                }
                              }}
                            />
                            {field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  field.onChange(null);
                                  form.setValue("distance", null);
                                }}
                                className="shrink-0 h-8 text-sm"
                              >
                                Clear location
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Distance (miles)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={500}
                              placeholder="Enter radius (1-500 miles)"
                              className="w-full h-9 text-sm"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value < 1) {
                                  field.onChange(1);
                                } else if (value > 500) {
                                  field.onChange(500);
                                } else {
                                  field.onChange(value || null);
                                }
                              }}
                              disabled={!form.getValues("location")}
                            />
                          </FormControl>
                          <FormDescription className="text-xs mt-1">
                            {form.getValues("location")
                              ? "Enter a distance between 1 and 500 miles"
                              : "Select a location to set search radius"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 border-t bg-background px-4 py-2 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row-reverse">
                  <Button
                    type="submit"
                    className="w-full h-9 text-sm"
                    onClick={form.handleSubmit(handleSubmit)}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-9 text-sm"
                    onClick={() => {
                      form.reset({
                        minAge: "",
                        maxAge: "",
                        breed: "all",
                        distance: null,
                        location: null,
                      });
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
