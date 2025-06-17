import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const SearchInput = ({
  searchQuery,
  setSearchQuery,
}: SearchInputProps) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-9 border-0 bg-muted/50"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
