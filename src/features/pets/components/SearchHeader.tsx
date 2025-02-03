import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Shuffle,
  X,
  ArrowUpDown,
} from "lucide-react";
import { useSearchParams, useParams } from "react-router-dom";
import { useBreeds } from "../hooks/useBreeds";
import { useState } from "react";
import { type Filters } from "../schemas/filters";
import { FilterSheet } from "./FilterSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiDog } from "react-icons/pi";
import { GiSittingDog } from "react-icons/gi";
type QuickFilterType = "puppy" | "senior" | "random" | "nearby";

export function SearchHeader() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const { data: breeds = [], isLoading: isLoadingBreeds } = useBreeds({
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleSortChange = (value: string) => {
    searchParams.set("sort", value);
    setSearchParams(searchParams);
  };

  const handleFilterApply = (values: Filters) => {
    const newParams = new URLSearchParams(searchParams);

    if (values.minAge) {
      newParams.set("ageMin", values.minAge);
    } else {
      newParams.delete("ageMin");
    }

    if (values.maxAge) {
      newParams.set("ageMax", values.maxAge);
    } else {
      newParams.delete("ageMax");
    }

    if (values.breed === "all") {
      newParams.delete("breed");
    } else {
      newParams.set("breed", values.breed);
    }

    setSearchParams(newParams);
    setIsOpen(false);
  };

  const handleQuickFilter = (type: QuickFilterType) => {
    const newParams = new URLSearchParams(searchParams);

    if (type === "puppy") {
      newParams.set("ageMin", "0");
      newParams.set("ageMax", "2");
    } else if (type === "senior") {
      newParams.set("ageMin", "7");
      newParams.delete("ageMax");
    } else if (type === "random") {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
      newParams.set("breed", randomBreed);
    } else if (type === "nearby") {
      newParams.set("distance", "25");
    }

    setSearchParams(newParams);
  };

  const filterSheet = (
    <FilterSheet
      type={type}
      breeds={breeds}
      isLoadingBreeds={isLoadingBreeds}
      defaultValues={{
        minAge: searchParams.get("ageMin") || "",
        maxAge: searchParams.get("ageMax") || "",
        breed: searchParams.get("breed") || "all",
      }}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onApplyFilters={handleFilterApply}
    />
  );

  const quickFilters = (showTooltips = false) => (
    <div className="flex gap-2">
      {showTooltips ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuickFilter("puppy")}
              >
                <PiDog className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Puppies (0-2 years)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuickFilter("senior")}
              >
                <GiSittingDog className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Senior Sweethearts (7+ years)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuickFilter("nearby")}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Within 25 miles
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuickFilter("random")}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Pup Luck! (Random Breed)
            </TooltipContent>
          </Tooltip>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuickFilter("puppy")}
          >
            <PiDog className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuickFilter("senior")}
          >
            <GiSittingDog className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuickFilter("nearby")}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuickFilter("random")}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );

  const FilterPills = () => (
    <div className="flex flex-wrap gap-2">
      {searchParams.get("breed") && (
        <Badge variant="secondary" className="gap-1">
          {searchParams.get("breed")}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("breed");
              setSearchParams(newParams);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {(searchParams.get("ageMin") || searchParams.get("ageMax")) && (
        <Badge variant="secondary" className="gap-1">
          {searchParams.get("ageMin") || "0"}-
          {searchParams.get("ageMax") || "∞"} years
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("ageMin");
              newParams.delete("ageMax");
              setSearchParams(newParams);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {searchParams.get("distance") && (
        <Badge variant="secondary" className="gap-1">
          Within {searchParams.get("distance")} miles
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("distance");
              setSearchParams(newParams);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile View */}
      <div className="container flex flex-col gap-3 py-3 lg:hidden">
        {/* First row: Search, Sort, and Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-2 flex items-center">
              <Search className="h-4 w-4 text-foreground dark:text-white" />
            </div>
            <Input
              placeholder="Search breeds..."
              className="pl-8 border-input placeholder:text-foreground dark:placeholder:text-white"
              onChange={(e) => {
                console.log(e);
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => handleSortChange("breed:asc")}>
                Breed (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("breed:desc")}>
                Breed (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("age:asc")}>
                Age (Youngest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("age:desc")}>
                Age (Oldest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {filterSheet}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            {isFiltersExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Collapsible section */}
        {isFiltersExpanded && (
          <>
            {/* Second row: Quick Filters */}
            <div className="flex justify-start">{quickFilters(false)}</div>

            {/* Third row: Active Filters */}
            {(searchParams.get("breed") ||
              searchParams.get("ageMin") ||
              searchParams.get("ageMax") ||
              searchParams.get("distance")) && (
              <div className="flex flex-wrap gap-2 items-center">
                <FilterPills />
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex flex-col container gap-3 py-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Select
              defaultValue={searchParams.get("sort") || "breed:asc"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Sort by..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breed:asc">Breed (A-Z)</SelectItem>
                <SelectItem value="breed:desc">Breed (Z-A)</SelectItem>
                <SelectItem value="age:asc">Age (Youngest)</SelectItem>
                <SelectItem value="age:desc">Age (Oldest)</SelectItem>
              </SelectContent>
            </Select>
            {quickFilters(true)}
            {filterSheet}
          </div>

          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-2 flex items-center">
              <Search className="h-4 w-4 text-foreground dark:text-white" />
            </div>
            <Input
              placeholder="Search breeds..."
              className="pl-8 border-input placeholder:text-foreground dark:placeholder:text-white"
              onChange={(e) => {
                // We'll implement breed search/filter later
              }}
            />
          </div>
        </div>
        {/* Desktop filter pills without label */}
        {(searchParams.get("breed") ||
          searchParams.get("ageMin") ||
          searchParams.get("ageMax")) && <FilterPills />}
      </div>
    </div>
  );
}
