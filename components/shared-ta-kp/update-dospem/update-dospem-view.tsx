"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  UserCog,
  Users,
  History,
  GraduationCap,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import PaginationControls from "@/components/pagination-control";

export interface MahasiswaDospem {
  mahasiswa_id: number;
  project_id?: number;
  name: string;
  nim: string;
  dosen_name: string | null;
  photo: string | null;
}

export interface DosenDospem {
  dosen_id: number;
  npp: string;
  name: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  sisa_kuota: number;
}

export interface RiwayatDospem {
  tanggal: string;
  dosen_lama: string | null;
  dosen_baru: string | null;
  diubah_oleh: string | null;
}

interface UpdateDospemViewProps {
  mhsList: MahasiswaDospem[];
  mhsLoading: boolean;
  mhsLastPage: number;
  mhsTotal: number;
  mhsLimit: number;
  search: string;
  onSearchChange: (s: string) => void;
  page: number;
  onPageChange: (p: number) => void;

  dosenList: DosenDospem[];
  dosenLoading: boolean;
  filteredDosen: DosenDospem[];
  selectedDosen: DosenDospem | undefined;
  dosenSearch: string;
  onDosenSearchChange: (s: string) => void;
  dosenOpen: boolean;
  onDosenOpenChange: (open: boolean) => void;
  dosenId: number | null;
  onDosenIdChange: (id: number | null) => void;

  selected: MahasiswaDospem | null;
  onSelectMahasiswa: (m: MahasiswaDospem) => void;

  riwayat: RiwayatDospem[];
  riwayatLoading: boolean;

  submitting: boolean;
  confirmOpen: boolean;
  onConfirmOpenChange: (open: boolean) => void;
  onRequestConfirm: () => void;
  onSubmit: () => Promise<void>;

  getDosenLabel: (d: DosenDospem) => string;

  // Optional: isKonversi for KP
  isKonversi?: boolean;
  onIsKonversiChange?: (checked: boolean) => void;

  // Optional: reset dospem (KP only, BE supports dosen_id null)
  confirmResetOpen?: boolean;
  onConfirmResetOpenChange?: (open: boolean) => void;
  onRequestResetConfirm?: () => void;
  onReset?: () => Promise<void>;
}

export function UpdateDospemView({
  mhsList,
  mhsLoading,
  mhsLastPage,
  mhsTotal,
  mhsLimit,
  search,
  onSearchChange,
  page,
  onPageChange,
  dosenList,
  dosenLoading,
  filteredDosen,
  selectedDosen,
  dosenSearch,
  onDosenSearchChange,
  dosenOpen,
  onDosenOpenChange,
  dosenId,
  onDosenIdChange,
  selected,
  onSelectMahasiswa,
  riwayat,
  riwayatLoading,
  submitting,
  confirmOpen,
  onConfirmOpenChange,
  onRequestConfirm,
  onSubmit,
  getDosenLabel,
  isKonversi,
  onIsKonversiChange,
  confirmResetOpen,
  onConfirmResetOpenChange,
  onRequestResetConfirm,
  onReset,
}: UpdateDospemViewProps) {
  const showReset = !!onRequestResetConfirm;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      {/* Left: Mahasiswa list */}
      <div className="border rounded-xl overflow-hidden flex flex-col h-full bg-card shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3.5 border-b bg-muted/30">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Daftar Mahasiswa</span>
        </div>

        <div className="px-3 py-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIM..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-[450px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 z-10">
              <TableRow>
                <TableHead className="text-xs">Mahasiswa</TableHead>
                <TableHead className="text-xs">Dospem Saat Ini</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mhsLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground h-24"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : mhsList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground h-24 text-sm"
                  >
                    Tidak ada mahasiswa ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                mhsList.map((m, i) => (
                  <TableRow
                    key={`${m.mahasiswa_id}-${m.project_id ?? "x"}-${i}`}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 transition-colors",
                      selected?.mahasiswa_id === m.mahasiswa_id &&
                        "bg-primary/5 border-l-2 border-l-primary",
                    )}
                    onClick={() => {
                      onSelectMahasiswa(m);
                      onDosenIdChange(null);
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 shrink-0">
                          {m.photo && (
                            <AvatarImage
                              src={m.photo}
                              alt={m.name}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {m.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {m.nim}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {m.dosen_name ? (
                        <span className="text-sm">{m.dosen_name}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          Belum ada
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {(mhsLastPage > 1 || mhsTotal > 0) && (
          <div className="border-t px-4 py-3 bg-muted/10">
            <PaginationControls
              currentPage={page}
              lastPage={mhsLastPage}
              total={mhsTotal}
              defaultLimit={mhsLimit}
              onPageChange={onPageChange}
              onLimitChange={() => {}}
            />
          </div>
        )}
      </div>

      {/* Right: Form + Riwayat */}
      <div className="flex flex-col h-full space-y-4">
        {selected ? (
          <>
            <div className="border rounded-xl overflow-hidden bg-card shadow-sm shrink-0">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b bg-muted/30">
                <UserCog className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">
                  Ganti Dosen Pembimbing
                </span>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                  <Avatar className="h-10 w-10 shrink-0">
                    {selected.photo && (
                      <AvatarImage
                        src={selected.photo}
                        alt={selected.name}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(selected.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">
                        {selected.name}
                      </span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {selected.nim}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {selected.dosen_name ?? (
                          <span className="italic">
                            Belum ada dosen pembimbing
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Pilih Dosen Pembimbing Baru</Label>
                  <Popover open={dosenOpen} onOpenChange={onDosenOpenChange} modal>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        disabled={dosenLoading}
                      >
                        {dosenLoading ? (
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memuat dosen...
                          </span>
                        ) : selectedDosen ? (
                          <span className="truncate">
                            {getDosenLabel(selectedDosen)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Pilih dosen...
                          </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Cari nama atau NPP dosen..."
                          value={dosenSearch}
                          onValueChange={onDosenSearchChange}
                        />
                        <CommandList>
                          <CommandEmpty>Dosen tidak ditemukan.</CommandEmpty>
                          <CommandGroup className="max-h-[220px] overflow-y-auto">
                            {filteredDosen.map((d) => (
                              <CommandItem
                                key={d.dosen_id}
                                value={d.dosen_id.toString()}
                                onSelect={() => {
                                  onDosenIdChange(d.dosen_id);
                                  onDosenOpenChange(false);
                                  onDosenSearchChange("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    dosenId === d.dosen_id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <span className="flex-1 truncate">
                                  {getDosenLabel(d)}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {onIsKonversiChange && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-konversi"
                      checked={isKonversi}
                      onCheckedChange={onIsKonversiChange}
                    />
                    <Label htmlFor="is-konversi" className="cursor-pointer">
                      Mahasiswa Konversi
                    </Label>
                  </div>
                )}

                {showReset ? (
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Button
                      onClick={onRequestConfirm}
                      disabled={!dosenId || submitting}
                      className="w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={onRequestResetConfirm}
                      disabled={submitting || !selected.dosen_name}
                      className="w-full"
                    >
                      Reset Dospem
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={onRequestConfirm}
                    disabled={!dosenId || submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden flex-1 flex flex-col bg-card shadow-sm min-h-[300px]">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b bg-muted/30">
                <History className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">
                  Riwayat Perubahan Dospem
                </span>
                {riwayat.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {riwayat.length} entri
                  </span>
                )}
              </div>
              <div className="overflow-auto flex-1">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/50 z-10">
                    <TableRow>
                      <TableHead className="text-xs">Tanggal</TableHead>
                      <TableHead className="text-xs">Dosen Lama</TableHead>
                      <TableHead className="text-xs">Dosen Baru</TableHead>
                      <TableHead className="text-xs">Diubah Oleh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riwayatLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground h-16"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Memuat riwayat...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : riwayat.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground h-16 text-sm italic"
                        >
                          Belum ada riwayat perubahan
                        </TableCell>
                      </TableRow>
                    ) : (
                      riwayat.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">
                            {formatDate(r.tanggal)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {r.dosen_lama ?? "-"}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {r.dosen_baru ?? "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {r.diubah_oleh ?? "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <div className="border rounded-xl shadow-sm flex flex-col items-center justify-center h-full min-h-[500px] gap-3 text-muted-foreground bg-muted/10 border-dashed">
            <UserCog className="h-10 w-10 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Pilih mahasiswa terlebih dahulu
              </p>
              <p className="text-xs mt-0.5">
                Klik salah satu baris di tabel kiri
              </p>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={onConfirmOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Konfirmasi Perubahan Dosen Pembimbing
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengganti dosen pembimbing{" "}
              <span className="font-semibold text-foreground">
                {selected?.name}
              </span>{" "}
              menjadi{" "}
              <span className="font-semibold text-foreground">
                {selectedDosen ? getDosenLabel(selectedDosen) : "—"}
              </span>
              ? Perubahan ini akan dicatat dalam riwayat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onConfirmOpenChange(false);
                onSubmit();
              }}
            >
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showReset && (
        <AlertDialog
          open={confirmResetOpen}
          onOpenChange={onConfirmResetOpenChange}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Reset Dospem</AlertDialogTitle>
              <AlertDialogDescription>
                Dosen pembimbing untuk{" "}
                <span className="font-semibold text-foreground">
                  {selected?.name}
                </span>{" "}
                akan direset. ACC dosen yang sudah ada akan dibatalkan.
                Lanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  onConfirmResetOpenChange?.(false);
                  void onReset?.();
                }}
              >
                Ya, Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
