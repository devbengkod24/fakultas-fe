"use client";

import { useState } from "react";
import useSWR from "swr";
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
import { PlottingJadwalService } from "@/api/kerja-praktek";

interface Ruangan {
  id: number;
  nama_ruangan: string;
  gedung?: string | null;
}

interface RuanganComboboxProps {
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
}

export function RuanganCombobox({ value, onChange, disabled }: RuanganComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data } = useSWR(
    "ruangan-list-plot-kp",
    () => PlottingJadwalService.getRuangan().then((r) => r.data ?? []),
    { revalidateOnFocus: false },
  );
  const ruanganList: Ruangan[] = (data as Ruangan[]) ?? [];

  const filtered = ruanganList.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.nama_ruangan.toLowerCase().includes(q) ||
      (r.gedung ?? "").toLowerCase().includes(q)
    );
  });

  const selected = ruanganList.find((r) => r.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          role="combobox"
          className="w-full justify-between font-normal text-sm h-9"
        >
          <span className="truncate">
            {selected
              ? `${selected.nama_ruangan}${selected.gedung ? ` — ${selected.gedung}` : ""}`
              : "Pilih ruangan"}
          </span>
          <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari ruangan..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {value && (
                <CommandItem
                  value="__clear"
                  onSelect={() => { onChange(null); setOpen(false); setSearch(""); }}
                  className="text-muted-foreground italic text-xs"
                >
                  — Kosongkan
                </CommandItem>
              )}
              {filtered.map((r) => (
                <CommandItem
                  key={r.id}
                  value={String(r.id)}
                  onSelect={() => { onChange(r.id); setOpen(false); setSearch(""); }}
                >
                  <Check
                    className={cn("mr-2 h-3 w-3", value === r.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{r.nama_ruangan}</span>
                    {r.gedung && (
                      <span className="text-[10px] text-muted-foreground">{r.gedung}</span>
                    )}
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
