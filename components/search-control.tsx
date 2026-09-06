  "use client";

  import { useState, useEffect, useRef } from "react";
  import { useSearchParams, useRouter, usePathname } from "next/navigation";
  import { Input } from "@/components/ui/input";
  import { Search, X } from "lucide-react";

  interface SearchControlProps {
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
  }

  export default function SearchControl({
    placeholder = "Cari...",
    className,
    value,
    onChange,
  }: SearchControlProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState(
      value || searchParams.get("search") || ""
    );
    const prevSearchTerm = useRef(searchTerm);
    const isInitialized = useRef(false);

    useEffect(() => {
      if (value !== undefined) {
        setSearchTerm(value);
      }
    }, [value]);

    useEffect(() => {

      // Skip pada render pertama
      if (!isInitialized.current) {
        isInitialized.current = true;
        prevSearchTerm.current = searchTerm;
        return;
      }

      const handler = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        
        const hasSearchChanged = prevSearchTerm.current !== searchTerm;

        if (searchTerm) {
          params.set("search", searchTerm);
          if (hasSearchChanged) {
            params.set("page", "1");
          }
        } else {
          params.delete("search");
          if (hasSearchChanged) {
            params.set("page", "1");
          }
        }

        if (hasSearchChanged) {
          prevSearchTerm.current = searchTerm;
          router.push(`${pathname}?${params.toString()}`);
        }
      }, 500);

      return () => clearTimeout(handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, searchParams, router]);

    const handleClear = () => {
      setSearchTerm("");
      onChange?.("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          className="w-full pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
