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
      <SelectTrigger className="w-10 lg:w-auto">
        <SelectValue>
          {showText ? (
            <span className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {sortOptions[currentSort as keyof typeof sortOptions]}
            </span>
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
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
