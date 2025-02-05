import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SearchPopoverProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  triggerText?: string;
  searchPlaceholder?: string;
  showAllOption?: boolean;
  allOptionText?: string;
}

export function SearchPopover({
  options,
  value,
  onChange,
  isLoading = false,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  triggerText,
  showAllOption = true,
  allOptionText = "All",
}: SearchPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const displayValue = value === "all" ? allOptionText : value;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {triggerText ?? displayValue ?? placeholder}
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
        side="bottom"
        sideOffset={4}
        alignOffset={0}
      >
        <div className="p-2 border-b">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div
          className="overflow-y-auto touch-auto"
          style={{
            maxHeight: "calc(100vh - 200px)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isLoading ? (
            <div className="p-8 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                Fetching breeds...
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {showAllOption && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange("all");
                    setIsOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {allOptionText}
                </Button>
              )}
              {filteredOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
