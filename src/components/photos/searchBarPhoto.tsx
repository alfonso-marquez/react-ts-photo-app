import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-md">
            <Input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
            />
            {searchTerm && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setSearchTerm("");
                        onSearch("");
                    }}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
            <Button type="submit">Search</Button>
        </form>
    );
}
