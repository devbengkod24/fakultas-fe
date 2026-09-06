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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Mahasiswa } from "@/types/kerja-praktek/mahasiswa";
import type { SortConfig } from "@/types/kerja-praktek/sortconfig";
import { MahasiswaService, DosenService } from "@/api/kerja-praktek";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useProfile } from "@/context/profileUseContext";

interface UpdateDosenPembimbingModalProps {
  onClose: () => void
  mahasiswaList: Mahasiswa[]
  onUpdate: (selectedIds: (string | number)[], dosenId: string | number | null, isKonversi: boolean) => void
}

interface DosenUpdateDospem {
  id: number;
  gelar_depan: string | null;
  nama: string;
  gelar_belakang: string | null;
}

// Sortable Header Components
interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: keyof SortConfig;
  currentSort?: SortConfig;
  onSort: (sortConfig: SortConfig) => void;
}

const SortableHeader = ({ children, sortKey, currentSort, onSort }: SortableHeaderProps) => {
  const currentDirection = currentSort?.[sortKey];
  
  const handleClick = () => {
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    onSort({ [sortKey]: newDirection } as SortConfig);
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

interface PembimbingHeaderProps {
  currentSort?: SortConfig;
  onSort: (sortConfig: SortConfig) => void;
}

const PembimbingHeader = ({ currentSort, onSort }: PembimbingHeaderProps) => {
  const currentValue = currentSort?.pembimbing;

  const handleClick = () => {
    let newValue: "asc" | "desc" | "none";
    if (currentValue === "asc") {
      newValue = "desc";
    } else if (currentValue === "desc") {
      newValue = "none";
    } else {
      newValue = "asc";
    }
    onSort({ pembimbing: newValue } as SortConfig);
  };

  const getIcon = () => {
    if (currentValue === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    } else if (currentValue === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const getTooltip = () => {
    if (currentValue === "asc") return "Menampilkan yang ada pembimbing";
    if (currentValue === "desc") return "Menampilkan yang belum ada pembimbing";
    return "Klik untuk filter pembimbing";
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="h-auto p-0 font-medium hover:bg-transparent text-left"
      title={getTooltip()}
    >
      Dosen Pembimbing Saat Ini
      {getIcon()}
    </Button>
  );
};

const dosenUpdateDospemFetcher = (prodi_id?: number) =>
  DosenService.getDosenUpdateDospem(prodi_id).then((res) => res);

const mahasiswaFetcher = (page: number, limit: number, search: string, periode_id?: number, sort?: SortConfig, prodi_id?: number) =>
  MahasiswaService.getAllMahasiswa(page, limit, search, periode_id, sort, prodi_id).then((res) => res);

export function DaftarMahasiswaUpdateDospem({ onClose, mahasiswaList, onUpdate }: UpdateDosenPembimbingModalProps) {
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosenId, setSelectedDosenId] = useState<string | number>("")
  const [isOpenDosen, setIsOpenDosen] = useState(false)
  const [dosenSearchTerm, setDosenSearchTerm] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [mahasiswaData, setMahasiswaData] = useState<Mahasiswa[]>(mahasiswaList)
  const [isKonversi, setIsKonversi] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [selectedMahasiswaIds, setSelectedMahasiswaIds] = useState<(string | number)[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined)

  const { data: dosenData, error: dosenError, isLoading: dosenLoading } = useSWR(
    ["dosen-update-dospem", activeProdiId ?? undefined],
    () => dosenUpdateDospemFetcher(activeProdiId ?? undefined),
    {
      revalidateOnFocus: false,
      refreshInterval: 0
    }
  );

  const { data: mahasiswaRefreshData, isLoading: mahasiswaLoading } = useSWR(
    ["mahasiswa-refresh", 1, 10000, "", periode_id, sortConfig, refreshTrigger, activeProdiId ?? undefined],
    () => mahasiswaFetcher(1, 10000, "", periode_id, sortConfig, activeProdiId ?? undefined),
    {
      revalidateOnFocus: false,
      refreshInterval: 0
    }
  );

  useEffect(() => {
    if (mahasiswaRefreshData?.data) {
      setMahasiswaData(mahasiswaRefreshData.data);
    }
  }, [mahasiswaRefreshData]);

  const dosenList: DosenUpdateDospem[] = dosenData?.data ?? [];

  const filteredDosenList = dosenList.filter((dosen) => {
    const searchLower = dosenSearchTerm.toLowerCase();
    const namaMatch = dosen.nama.toLowerCase().includes(searchLower);
    const gelarDepanMatch = dosen.gelar_depan?.toLowerCase().includes(searchLower) ?? false;
    const gelarBelakangMatch = dosen.gelar_belakang?.toLowerCase().includes(searchLower) ?? false;
    
    return namaMatch || gelarDepanMatch || gelarBelakangMatch;
  });

  const handleDosenSelect = (value: string) => {
    const dosen = dosenList.find((d: DosenUpdateDospem) => d.id.toString() === value);
    if (dosen) {
      setSelectedDosenId(dosen.id);
      setIsOpenDosen(false);
      setDosenSearchTerm("");
    }
  };

  // Handler untuk sort dari table header
  const handleTableSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
  };

  const filteredMahasiswa = mahasiswaData.filter(
    (mahasiswa) =>
      mahasiswa.id !== undefined &&
      ((mahasiswa.nama?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (mahasiswa.dosen_pembimbing?.nama?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (mahasiswa.nim?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (mahasiswa.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()))
  );

  const handleCheckboxChange = (mahasiswaId: string | number) => {
    if (mahasiswaId === undefined) return;

    setSelectedMahasiswaIds((prev) => {
      const idStr = String(mahasiswaId);

      if (prev.some(item => String(item) === idStr)) {
        return prev.filter((item) => String(item) !== idStr);
      } else {
        return [...prev, mahasiswaId];
      }
    });
  };

  const handleSelectAll = () => {
    const validMahasiswaIds = filteredMahasiswa
      .filter(m => m.id !== undefined)
      .map(m => m.id!);

    const allSelected = validMahasiswaIds.length > 0 &&
      validMahasiswaIds.every(id => selectedMahasiswaIds.some(selectedId =>
        String(selectedId) === String(id)));

    if (allSelected) {
      setSelectedMahasiswaIds([]);
    } else {
      setSelectedMahasiswaIds(validMahasiswaIds);
    }
  };

  const handleSubmit = () => {
    if (selectedMahasiswaIds.length === 0) {
      toast.error("Error", {
        description: "Pilih minimal satu mahasiswa",
      });
      return;
    }

    if (!isResetMode && !selectedDosenId) {
      toast.error("Error", {
        description: "Pilih dosen pembimbing atau aktifkan mode reset",
      });
      return;
    }

    const selectedProjectIds = mahasiswaData
      .filter(m => selectedMahasiswaIds.some(selectedId => 
        String(selectedId) === String(m.id)
      ))
      .map(m => m.project_id)
      .filter(projectId => projectId !== undefined) as (string | number)[];

    if (selectedProjectIds.length === 0) {
      toast.error("Error", {
        description: "Mahasiswa yang dipilih tidak memiliki project yang valid",
      });
      return;
    }

    // Jika reset mode, kirim null sebagai dosen_id
    onUpdate(selectedProjectIds, isResetMode ? null : selectedDosenId, isKonversi);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getSelectedDosenName = () => {
    if (!selectedDosenId) return "";
    const dosen = dosenList.find((dosen: DosenUpdateDospem) => dosen.id.toString() === selectedDosenId.toString());
    if (!dosen) return "";

    const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
    const nama = dosen.nama ?? "";
    const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";

    return `${gelarDepan}${nama}${gelarBelakang}`;
  };

  const getDosenDisplayName = (dosen: DosenUpdateDospem) => {
    const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
    const nama = dosen.nama ?? "";
    const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";

    return `${gelarDepan}${nama}${gelarBelakang}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Update Dosen Pembimbing</DialogTitle>
          <DialogDescription>Pilih mahasiswa dan dosen pembimbing yang akan diupdate.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Mode dan Konversi Selector */}
          <div className="flex flex-col space-y-2 p-3 bg-muted/40 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is-reset" 
                checked={isResetMode}
                onCheckedChange={(checked) => {
                  setIsResetMode(checked === true);
                  if (checked) {
                    setSelectedDosenId("");
                    setIsKonversi(false);
                  }
                }}
              />
              <Label htmlFor="is-reset" className="text-amber-600 font-medium cursor-pointer">
                Reset Dosen Pembimbing (Hapus dosen dari mahasiswa)
              </Label>
            </div>
            
            {!isResetMode && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-konversi" 
                  checked={isKonversi}
                  onCheckedChange={(checked) => setIsKonversi(checked === true)}
                />
                <Label htmlFor="is-konversi" className="cursor-pointer">Mahasiswa Konversi</Label>
              </div>
            )}
          </div>

          {/* Toolbar dengan Sort Selector */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedMahasiswaIds.length === filteredMahasiswa.filter(m => m.id).length && 
                         filteredMahasiswa.filter(m => m.id).length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">Pilih Semua</Label>
            </div>

            {/* Search Input */}
            <div className="flex-1 mx-2">
              <Input 
                placeholder="Cari mahasiswa..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="h-9"
              />
            </div>

            {/* Refresh Button */}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={mahasiswaLoading}>
              {mahasiswaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          <div className="border rounded-md max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>
                    <SortableHeader 
                      sortKey="nim" 
                      currentSort={sortConfig} 
                      onSort={handleTableSort}
                    >
                      NIM
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader 
                      sortKey="name" 
                      currentSort={sortConfig} 
                      onSort={handleTableSort}
                    >
                      Nama
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <PembimbingHeader 
                      currentSort={sortConfig} 
                      onSort={handleTableSort}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mahasiswaLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mb-2" />
                        <span className="text-sm text-muted-foreground">Memuat data mahasiswa...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredMahasiswa.length > 0 ? (
                  filteredMahasiswa.map((mahasiswa, index) => (
                    <TableRow key={mahasiswa.id ?? index}>
                      <TableCell>
                        {mahasiswa.id !== undefined && (
                          <Checkbox
                            checked={selectedMahasiswaIds.some(id =>
                              String(id) === String(mahasiswa.id))}
                            onCheckedChange={() => mahasiswa.id !== undefined &&
                              handleCheckboxChange(mahasiswa.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell>{mahasiswa.nim}</TableCell>
                      <TableCell>
                        {mahasiswa.nama}
                      </TableCell>
                      <TableCell>
                        {mahasiswa.dosen_pembimbing ? (
                          <>
                            {mahasiswa.dosen_pembimbing.gelar_depan &&
                              `${mahasiswa.dosen_pembimbing.gelar_depan} `}
                            {mahasiswa.dosen_pembimbing.nama}
                            {mahasiswa.dosen_pembimbing.gelar_belakang &&
                              `, ${mahasiswa.dosen_pembimbing.gelar_belakang}`}
                          </>
                        ) : (
                          <span className="text-muted-foreground">Belum ditentukan</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Tidak ada data mahasiswa yang sesuai
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <Label htmlFor="dosen-select" className="block mb-2">
              Pilih Dosen Pembimbing
            </Label>

            <Popover open={isOpenDosen} onOpenChange={setIsOpenDosen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpenDosen}
                  className="w-full justify-between"
                  disabled={dosenLoading || isResetMode}
                >
                  {isResetMode ? (
                    "Mode Reset - Dosen akan dihapus"
                  ) : dosenLoading ? (
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
              <PopoverContent 
                className="w-[--radix-popover-trigger-width] p-0" 
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Cari dosen..."
                    value={dosenSearchTerm}
                    onValueChange={setDosenSearchTerm}
                    disabled={dosenLoading}
                  />
                  <CommandEmpty>
                    {dosenLoading ? (
                      <div className="py-6 flex flex-col items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mb-2" />
                        <span className="text-sm text-muted-foreground">Memuat dosen...</span>
                      </div>
                    ) : dosenError ? (
                      <span className="py-6 text-center text-sm text-destructive">
                        Gagal memuat data dosen
                      </span>
                    ) : (
                      <span className="py-6 text-center text-sm">
                        Tidak ditemukan dosen
                      </span>
                    )}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {filteredDosenList.map((dosen: DosenUpdateDospem) => {
                      const dosenId = dosen.id.toString();
                      const displayName = getDosenDisplayName(dosen);
                      
                      return (
                        <CommandItem
                          key={dosen.id}
                          value={displayName}
                          onSelect={() => handleDosenSelect(dosenId)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDosenId.toString() === dosenId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex-1 truncate">
                            {displayName}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {dosenError && (
              <p className="text-xs text-destructive mt-1">
                Gagal memuat daftar dosen
              </p>
            )}
            {isResetMode && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Mode reset aktif - Dosen pembimbing akan dihapus dari mahasiswa yang dipilih
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              selectedMahasiswaIds.length === 0 ||
              (!isResetMode && !selectedDosenId) ||
              mahasiswaLoading ||
              dosenLoading
            }
            variant={isResetMode ? "destructive" : "default"}
          >
            {isResetMode ? "Reset Dosen Pembimbing" : "Update Dosen Pembimbing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}