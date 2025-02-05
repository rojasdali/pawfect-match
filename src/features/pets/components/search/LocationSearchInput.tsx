import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useLocationSearch,
  useNearestCity,
  type LocationSuggestion,
} from "../../hooks/useLocationSearch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LocationSearchInputProps {
  value?: LocationSuggestion | null;
  onChange: (location: LocationSuggestion | null) => void;
}

export function LocationSearchInput({
  value,
  onChange,
}: LocationSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: locations = [], isLoading } = useLocationSearch(searchValue);
  const nearestCity = useNearestCity();

  const handleLocationSelect = (location: LocationSuggestion) => {
    onChange(location);
    setIsOpen(false);
    setSearchValue("");
  };

  const handleLocateMe = async () => {
    try {
      const result = await nearestCity.refetch();
      if (result.data) {
        handleLocationSelect(result.data);
      }
    } catch (error) {
      console.error("Error getting nearest city:", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-8 text-sm"
        >
          {value?.display ?? "Search location..."}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[--trigger-width]"
        style={
          {
            "--trigger-width": "var(--radix-popover-trigger-width)",
          } as React.CSSProperties
        }
        align="start"
      >
        <div className="p-2 border-b space-y-2">
          <Input
            placeholder="Search cities or zip codes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-8 text-sm focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setIsOpen(false);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-8 text-sm"
            onClick={handleLocateMe}
            disabled={nearestCity.isLoading}
          >
            <MapPin className="h-3 w-3 mr-1" />
            {nearestCity.isLoading ? "Locating..." : "Locate me"}
          </Button>
        </div>
        <div
          className="overflow-y-auto touch-auto"
          style={{
            maxHeight: "min(calc(100vh - 200px), 250px)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isLoading && searchValue.length >= 2 ? (
            <div className="p-4 text-center">
              <LoadingSpinner size="md" />
              <p className="text-xs text-muted-foreground mt-1">
                Searching locations...
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {locations.length === 0 && searchValue.length >= 2 ? (
                <div className="p-2 text-center text-xs text-muted-foreground">
                  No locations found
                </div>
              ) : searchValue.length < 2 ? (
                <div className="p-2 text-center text-xs text-muted-foreground">
                  Type at least 2 characters to search...
                </div>
              ) : (
                locations.map((location: LocationSuggestion) => (
                  <Button
                    key={location.zip_code}
                    type="button"
                    variant="ghost"
                    className="w-full justify-start h-7 text-xs"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value?.zip_code === location.zip_code
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {location.display}
                  </Button>
                ))
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
