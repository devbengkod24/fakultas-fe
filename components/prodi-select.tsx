"use client";

import { Building2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useProfile } from "@/context/profileUseContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ProdiSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

const ProdiSelect = ({
  value,
  onChange,
  placeholder = "Pilih Program Studi",
  className,
}: ProdiSelectProps) => {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);

  const daftarProdi = useMemo(
    () => profile?.daftar_prodi || [],
    [profile]
  );

  const selectedProdi = useMemo(
    () => daftarProdi.find((p) => String(p.id) === value),
    [daftarProdi, value]
  );

  const triggerLabel = selectedProdi
    ? `${selectedProdi.kode_prodi} - ${selectedProdi.nama}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex items-center gap-2 h-9 px-3 min-w-[200px] justify-between",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate flex-1 text-left">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate font-medium">{triggerLabel}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Cari Program Studi..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Program studi tidak ditemukan.</CommandEmpty>
            <CommandGroup heading="Daftar Program Studi">
              {daftarProdi.map((prodi) => {
                const id = String(prodi.id);
                const isSelected = value === id;
                return (
                  <CommandItem
                    key={prodi.id}
                    value={`${prodi.kode_prodi} ${prodi.nama}`}
                    onSelect={() => {
                      onChange(isSelected ? null : id);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className={cn("font-medium", isSelected && "text-primary")}>
                        {prodi.kode_prodi}
                      </span>
                      <span className="text-muted-foreground truncate">
                        {prodi.nama}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProdiSelect;
