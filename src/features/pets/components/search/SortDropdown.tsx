import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortDropdownProps {
  onSortChange: (value: string) => void;
  showText?: boolean;
  currentSort: string;
}

const getSortLabel = (value: string) => {
  switch (value) {
    case "breed:asc":
      return "Breed (A-Z)";
    case "breed:desc":
      return "Breed (Z-A)";
    case "age:asc":
      return "Age (Youngest)";
    case "age:desc":
      return "Age (Oldest)";
    default:
      return "Breed (A-Z)";
  }
};

export function SortDropdown({
  onSortChange,
  showText = false,
  currentSort,
}: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={showText ? "default" : "icon"}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          {showText && <span>{getSortLabel(currentSort)}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => onSortChange("breed:asc")}>
          Breed (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("breed:desc")}>
          Breed (Z-A)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("age:asc")}>
          Age (Youngest)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("age:desc")}>
          Age (Oldest)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
