import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (value: string) => void;
  showText?: boolean;
}

export function SortDropdown({
  currentSort,
  onSortChange,
  showText = false,
}: SortDropdownProps) {
  const sortOptions = {
    "breed:asc": "Breed (A-Z)",
    "breed:desc": "Breed (Z-A)",
    "age:asc": "Age (Youngest)",
    "age:desc": "Age (Oldest)",
  };

  return (
    <Select value={currentSort} onValueChange={onSortChange}>
      <SelectTrigger className={showText ? "w-auto min-w-10" : "w-10"}>
        <SelectValue>
          <span className="flex items-center gap-2 truncate">
            <ArrowUpDown className="h-4 w-4 shrink-0" />
            {showText && (
              <span className="hidden lg:inline">
                {sortOptions[currentSort as keyof typeof sortOptions]}
              </span>
            )}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(sortOptions).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
