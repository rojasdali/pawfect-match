import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ onChange }: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-[380px] lg:max-w-none">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-8"
        onChange={onChange}
      />
    </div>
  );
}
