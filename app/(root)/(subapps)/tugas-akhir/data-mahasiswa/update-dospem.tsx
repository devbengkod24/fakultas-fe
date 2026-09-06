"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Mahasiswa } from "@/types/tugas-akhir/mahasiswa"
import { MahasiswaServiceV2, DosenService } from "@/api/tugas-akhir"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface UpdateDosenPembimbingModalProps {
  onClose: () => void
  mahasiswaList: Mahasiswa[]
  onUpdate: (selectedIds: (string | number)[], dosenId: string | number) => void
}

interface DosenData {
  dosen_id: number;
  npp: string;
  name: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  email: string;
  bidang_kajian: string | null;
  kuota: number;
  sisa_kuota: number;
}

// Sortable Header Components
interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort?: { key: string; order: "asc" | "desc" };
  onSort: (key: string) => void;
}

const SortableHeader = ({ children, sortKey, currentSort, onSort }: SortableHeaderProps) => {
  const isCurrentKey = currentSort?.key === sortKey;
  const currentDirection = isCurrentKey ? currentSort.order : undefined;
  
  const handleClick = () => {
    onSort(sortKey);
  };

  const getSortIcon = () => {
    if (currentDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    } else if (currentDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="h-auto p-0 font-medium hover:bg-transparent text-left"
    >
      {children}
      {getSortIcon()}
    </Button>
  );
};

const dosenFetcher = () =>
  DosenService.getAll(1, 1000, "", "", "").then((res) => res.data);

export function MahasiswaUpdateDospem({ onClose, mahasiswaList, onUpdate }: UpdateDosenPembimbingModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosenId, setSelectedDosenId] = useState<string | number>("")
  const [isOpenDosen, setIsOpenDosen] = useState(false)
  const [dosenSearchTerm, setDosenSearchTerm] = useState("")
  const [selectedMahasiswaIds, setSelectedMahasiswaIds] = useState<(string | number)[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" } | undefined>(undefined)

  const { data: dosenResponse, error: dosenError, isLoading: dosenLoading } = useSWR(
    "dosen-plotting-ta",
    dosenFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const dosenList: DosenData[] = dosenResponse ?? [];

  const filteredDosenList = dosenList.filter((dosen) => {
    const searchLower = dosenSearchTerm.toLowerCase();
    const nameMatch = dosen.name.toLowerCase().includes(searchLower);
    const nppMatch = dosen.npp?.toLowerCase().includes(searchLower) ?? false;
    
    return nameMatch || nppMatch;
  });

  const handleDosenSelect = (value: string) => {
    const dosen = dosenList.find((d: DosenData) => d.dosen_id.toString() === value);
    if (dosen) {
      setSelectedDosenId(dosen.dosen_id);
      setIsOpenDosen(false);
      setDosenSearchTerm("");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { key, order: "asc" };
    });
  };

  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: searchResults, isLoading: searchLoading } = useSWR(
    ["mahasiswa-search-dospem", debouncedSearch, sortConfig?.key, sortConfig?.order],
    ([, search, sortBy, sortOrder]) =>
      MahasiswaServiceV2.getAllV2(1, 50, search as string, "semua", sortBy as string, sortOrder as "asc" | "desc")
        .then((res) => res.data),
    {
      revalidateOnFocus: false,
    }
  );

  const sortedMahasiswa: Mahasiswa[] = searchResults || [];

  const handleCheckboxChange = (mahasiswaId: string | number) => {
    setSelectedMahasiswaIds((prev) => {
      const idStr = String(mahasiswaId);
      if (prev.some(item => String(item) === idStr)) {
        return prev.filter((item) => String(item) !== idStr);
      } else {
        return [...prev, mahasiswaId];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = sortedMahasiswa
        .map((m: Mahasiswa) => m.mahasiswa_id || m.id)
        .filter((id) => id !== undefined) as (string | number)[];
      setSelectedMahasiswaIds(allIds);
    } else {
      setSelectedMahasiswaIds([]);
    }
  };

  const handleSubmit = () => {
    if (selectedMahasiswaIds.length === 0) {
      toast.error("Pilih minimal satu mahasiswa");
      return;
    }

    if (!selectedDosenId) {
      toast.error("Pilih dosen pembimbing");
      return;
    }

    onUpdate(selectedMahasiswaIds, selectedDosenId);
  };

  const getSelectedDosenName = () => {
    if (!selectedDosenId) return "";
    const dosen = dosenList.find((dosen: DosenData) => dosen.dosen_id.toString() === selectedDosenId.toString());
    if (!dosen) return "";

    const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
    const name = dosen.name ?? "";
    const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";

    return `${gelarDepan}${name}${gelarBelakang}`;
  };

  const getDosenDisplayName = (dosen: DosenData) => {
    const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
    const name = dosen.name ?? "";
    const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";

    return `${gelarDepan}${name}${gelarBelakang}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Update Dosen Pembimbing</DialogTitle>
          <DialogDescription>Pilih mahasiswa dan dosen pembimbing yang akan diupdate.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Cari mahasiswa (Nama, NIM, atau Dosen)..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="h-9"
              />
            </div>
          </div>

          <div className="border rounded-md max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedMahasiswaIds.length === sortedMahasiswa.length && sortedMahasiswa.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader 
                      sortKey="nim" 
                      currentSort={sortConfig} 
                      onSort={handleSort}
                    >
                      NIM
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader 
                      sortKey="name" 
                      currentSort={sortConfig} 
                      onSort={handleSort}
                    >
                      Nama
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader 
                      sortKey="dosen_name" 
                      currentSort={sortConfig} 
                      onSort={handleSort}
                    >
                      Dosen Pembimbing
                    </SortableHeader>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMahasiswa.length > 0 ? (
                  sortedMahasiswa.map((mahasiswa: Mahasiswa) => {
                    const mId = mahasiswa.mahasiswa_id || mahasiswa.id;
                    return (
                      <TableRow key={mId}>
                        <TableCell>
                          <Checkbox
                            checked={selectedMahasiswaIds.some(id => String(id) === String(mId))}
                            onCheckedChange={() => mId && handleCheckboxChange(mId)}
                          />
                        </TableCell>
                        <TableCell>{mahasiswa.nim}</TableCell>
                        <TableCell className="font-medium">{mahasiswa.name}</TableCell>
                        <TableCell>
                          {mahasiswa.dosen_name || <span className="text-muted-foreground text-xs italic">Belum ada dospem</span>}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Tidak ada data mahasiswa ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2">
            <Label>Pilih Dosen Pembimbing Baru</Label>
            <Popover open={isOpenDosen} onOpenChange={setIsOpenDosen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpenDosen}
                  className="w-full justify-between"
                  disabled={dosenLoading}
                >
                  {dosenLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memuat daftar dosen...
                    </div>
                  ) : selectedDosenId ? (
                    getSelectedDosenName()
                  ) : (
                    "Pilih Dosen Pembimbing"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Cari dosen..."
                    value={dosenSearchTerm}
                    onValueChange={setDosenSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {dosenLoading ? "Memuat..." : "Dosen tidak ditemukan."}
                    </CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {filteredDosenList.map((dosen) => (
                        <CommandItem
                          key={dosen.dosen_id}
                          value={dosen.dosen_id.toString()}
                          onSelect={handleDosenSelect}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDosenId === dosen.dosen_id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {getDosenDisplayName(dosen)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 border-t mt-auto">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              selectedMahasiswaIds.length === 0 ||
              !selectedDosenId ||
              dosenLoading
            }
          >
            Update Dosen Pembimbing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
