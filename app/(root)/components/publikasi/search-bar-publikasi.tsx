"use client";

import { Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string, type: "title" | "author") => void;
  activeTab: string;
  searchQuery: string;
  searchType: "title" | "author";
}

const SearchBar = ({
  onSearch,
  activeTab,
  searchQuery,
  searchType,
}: SearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localType, setLocalType] = useState<"title" | "author">(searchType);

  // Update local state when props change
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalType(searchType);
  }, [searchType]);

  // Keep track of the current timeout
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Handle input change with auto-search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalQuery(newQuery);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search
    const newTimeout = setTimeout(() => {
      onSearch(newQuery, localType);
    }, 300); // Reduced to 300ms for better responsiveness

    setSearchTimeout(newTimeout);
  };

  // Handle search type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "title" | "author";
    setLocalType(newType);
    // Trigger search immediately with new type
    onSearch(localQuery, newType);
  };

  // Handle form submission (now optional since we have live search)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on form submit
    onSearch(localQuery, localType);
  };

  // Handle Enter key press (immediate search)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(localQuery, localType);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex max-w-xl mx-auto">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Ketik untuk mencari ${
              activeTab === "artikel" ? "artikel" : "riset"
            }...`}
            className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 shadow-sm transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={localType}
            onChange={handleTypeChange}
            className="h-full py-3 px-4 backdrop-blur-sm bg-white/10 text-white rounded-r-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none pr-8 hover:bg-white/20 transition-all duration-200"
          >
            <option value="title" className="bg-blue-800 text-white">
              Judul
            </option>
            <option value="author" className="bg-blue-800 text-white">
              Penulis
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
        </div>
      </form>
    </>
  );
};

export default SearchBar;
