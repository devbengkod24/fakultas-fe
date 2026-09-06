"use client";

import { useState } from "react";
import { ListFilter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterState {
  type: string | null;
}

export interface BeritaFilterProps {
  selectedType: string | null;
  categories: Array<{ id: string; label: string }>;
  onFilterChange: (filter: FilterState) => void;
}

export function BeritaFilter({
  selectedType,
  categories,
  onFilterChange,
}: BeritaFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = !!selectedType || isOpen;

  const handleCategoryClick = (typeId: string) => {
    onFilterChange({
      type: selectedType === typeId ? null : typeId,
    });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`h-full px-6 inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all border focus:outline-none focus-visible:ring-0 ${
            isActive
              ? "bg-primary text-white border-primary shadow-none"
              : "bg-white text-slate-600 border-gray-300 hover:border-primary hover:text-primary shadow-none"
          }`}
        >
          <ListFilter className="mr-2 h-4 w-4" />
          Filter
          {selectedType && (
            <span className="ml-2 bg-white/30 text-white text-xs rounded-full px-2 py-0.5 leading-none font-bold">
              1
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-56 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-y-auto"
      >
        <div className="mb-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Kategori Berita
          </p>
          <div className="space-y-0.5">
            {categories.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-primary-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
