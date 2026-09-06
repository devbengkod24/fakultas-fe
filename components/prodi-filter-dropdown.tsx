"use client";

import { Building2, ChevronDown, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useProfile } from "@/context/profileUseContext";
import {
  isGeneralProdiFilter,
  useProdiFilter,
} from "@/context/prodiFilterContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const ProdiFilterDropdown = () => {
  const { profile } = useProfile();
  const { selectedProdiIds, toggleProdiId, reset } = useProdiFilter();
  const [open, setOpen] = useState(false);

  const daftarProdi = useMemo(
    () => profile?.daftar_prodi || [],
    [profile]
  );

  const isGeneral = isGeneralProdiFilter(selectedProdiIds);
  
  const triggerLabel = useMemo(() => {
    if (isGeneral) return "General";
    if (selectedProdiIds.length === 1) {
      const prodi = daftarProdi.find((p) => String(p.id) === selectedProdiIds[0]);
      return prodi?.nama || "1 Prodi Terpilih";
    }
    return `${selectedProdiIds.length} Prodi Terpilih`;
  }, [isGeneral, selectedProdiIds, daftarProdi]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 h-9 px-3 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2 truncate flex-1 text-left">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate font-medium">
              {triggerLabel}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Cari Program Studi..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Program studi tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  reset();
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isGeneral ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {isGeneral && <Check className="h-3 w-3" />}
                  </div>
                  <span className="font-medium">General (Semua)</span>
                </div>
              </CommandItem>
            </CommandGroup>
            
            {daftarProdi.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Daftar Program Studi">
                  {daftarProdi.map((prodi) => {
                    const id = String(prodi.id);
                    const isActive = selectedProdiIds.includes(id);
                    return (
                      <CommandItem
                        key={prodi.id}
                        onSelect={() => {
                          toggleProdiId(id);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Checkbox 
                            checked={isActive}
                            onCheckedChange={() => toggleProdiId(id)}
                            className="pointer-events-none"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{prodi.nama}</span>
                            {prodi.kode_prodi && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                {prodi.kode_prodi}
                              </span>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {selectedProdiIds.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={reset}
                  className="justify-center text-center text-sm text-primary font-medium cursor-pointer"
                >
                  Reset Filter
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProdiFilterDropdown;
