"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface DosenOption {
  id: number;
  nama: string;
  gelar_depan?: string | null;
  gelar_belakang?: string | null;
}

interface DosenComboboxProps {
  value: number | null;
  onChange: (id: number | null) => void;
  dosenList: DosenOption[];
  placeholder?: string;
  excludeIds?: number[];
  disabled?: boolean;
}

export function DosenCombobox({
  value,
  onChange,
  dosenList,
  placeholder = "Pilih dosen",
  excludeIds = [],
  disabled,
}: DosenComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = dosenList.filter((d) => {
    if (excludeIds.includes(d.id)) return false;
    const q = search.toLowerCase();
    return d.nama.toLowerCase().includes(q);
  });

  const selected = dosenList.find((d) => d.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          role="combobox"
          className="w-full justify-between text-xs h-8 font-normal"
        >
          <span className="truncate">
            {selected ? selected.nama : placeholder}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari dosen..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {value && (
                <CommandItem
                  value="__clear"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="text-muted-foreground italic text-xs"
                >
                  — Kosongkan
                </CommandItem>
              )}
              {filtered.map((d) => (
                <CommandItem
                  key={d.id}
                  value={String(d.id)}
                  onSelect={() => {
                    onChange(d.id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === d.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs">{d.nama}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
