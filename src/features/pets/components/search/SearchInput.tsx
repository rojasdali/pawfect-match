import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ onChange }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-2 flex items-center">
        <Search className="h-4 w-4 text-foreground dark:text-white" />
      </div>
      <Input
        placeholder="Search breeds..."
        className="pl-8 border-input placeholder:text-foreground dark:placeholder:text-white"
        onChange={onChange}
      />
    </div>
  );
}
