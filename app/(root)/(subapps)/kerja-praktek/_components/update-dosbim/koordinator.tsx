"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import DashboardHeader from "@/components/dashboard-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  UserCog,
  Users,
  GraduationCap,
  History,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { DosenService, LogActivityService, MahasiswaService } from "@/api/kerja-praktek";
import withAuth from "@/app/(root)/hoc/withAuth";
import PaginationControls from "@/components/pagination-control";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { Mahasiswa } from "@/types/kerja-praktek/mahasiswa";
import { useProfile } from "@/context/profileUseContext";

interface DosenData {
  id: number;
  nama: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  sisa_kuota?: number;
}

interface ActivityLogItem {
  id: number;
  description: string;
  created_at: string;
}

const MHS_LIMIT = 10;

const getDosenLabel = (d: DosenData) => {
  const depan = d.gelar_depan ? `${d.gelar_depan} ` : "";
  const belakang = d.gelar_belakang ? `, ${d.gelar_belakang}` : "";
  return `${depan}${d.nama}${belakang}`;
};

const getPembimbingLabel = (m: Mahasiswa) => {
  const pembimbing = m.dosen_pembimbing;
  if (!pembimbing?.nama) return null;

  const depan = pembimbing.gelar_depan ? `${pembimbing.gelar_depan} ` : "";
  const belakang = pembimbing.gelar_belakang ? `, ${pembimbing.gelar_belakang}` : "";
  return `${depan}${pembimbing.nama}${belakang}`;
};

const fetchMahasiswa = (page: number, search: string, prodi_id?: number) =>
  MahasiswaService.getAllMahasiswa(page, MHS_LIMIT, search, undefined, undefined, prodi_id).then((res) => res);

const fetchDosen = (prodi_id?: number) =>
  DosenService.getDosenUpdateDospem(prodi_id).then((res) => (res?.data ?? []) as DosenData[]);

function UpdateDosbimClientPage() {
  const { activeProdiId } = useProfile();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Mahasiswa | null>(null);
  const [dosenId, setDosenId] = useState<number | null>(null);
  const [dosenOpen, setDosenOpen] = useState(false);
  const [dosenSearch, setDosenSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [isKonversi, setIsKonversi] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data: mhsResponse, isLoading: mhsLoading } = useSWR(
    ["kp-update-dospem", search, page, activeProdiId ?? undefined],
    () => fetchMahasiswa(page, search, activeProdiId ?? undefined),
    { revalidateOnFocus: false },
  );

  const { data: dosenData, isLoading: dosenLoading } = useSWR(
    ["kp-dosen-update-dospem", activeProdiId ?? undefined],
    () => fetchDosen(activeProdiId ?? undefined),
    { revalidateOnFocus: false },
  );

  const { data: activityData, isLoading: riwayatLoading } = useSWR(
    selected ? ["kp-riwayat-dospem-personal", selected.id] : null,
    () => LogActivityService.getLogLogbookKoordinator("dosen pembimbing KP", "1", 100),
    { revalidateOnFocus: false },
  );

  const mhsList: Mahasiswa[] = mhsResponse?.data ?? [];
  const mhsPagination = mhsResponse?.meta?.pagination;
  const lastPage = mhsPagination?.last_page ?? 1;
  const mhsTotal = mhsPagination?.total ?? 0;
  const dosenList: DosenData[] = dosenData ?? [];
  const riwayat: ActivityLogItem[] = selected
    ? (activityData?.data ?? []).filter((item: ActivityLogItem) =>
        (item.description.includes("Koordinator mengubah dosen pembimbing KP") ||
        item.description.includes("Koordinator mereset dosen pembimbing KP")) &&
        item.description.includes(selected.nama ?? "")
      )
    : [];

  const filteredDosen = useMemo(() => {
    if (!dosenSearch) return dosenList;
    const q = dosenSearch.toLowerCase();
    return dosenList.filter(
      (d) =>
        d.nama.toLowerCase().includes(q) ||
        (d.gelar_depan ?? "").toLowerCase().includes(q) ||
        (d.gelar_belakang ?? "").toLowerCase().includes(q),
    );
  }, [dosenList, dosenSearch]);

  const selectedDosen = dosenList.find((d) => d.id === dosenId);

  const applyDosen = async (targetDosenId: number | null) => {
    if (!selected?.project_id) {
      toast.error("Project mahasiswa tidak ditemukan");
      return;
    }

    setSubmitting(true);
    try {
      const res = await MahasiswaService.updateDospem([selected.project_id], targetDosenId, isKonversi);
      handleToastResponse(res);

      if (res?.success) {
        await mutate(["kp-update-dospem", search, page]);
        if (selected?.id) {
          await mutate(["kp-riwayat-dospem-personal", selected.id]);
        }
        await mutate("kp-dosen-update-dospem");
        if (selected?.id) {
          await mutate(["detail-mahasiswa", selected.id]);
        }

        if (targetDosenId === null) {
          setSelected((prev) => (prev ? { ...prev, dosen_pembimbing: undefined } : prev));
        } else if (selectedDosen) {
          setSelected((prev) =>
            prev
              ? {
                  ...prev,
                  dosen_pembimbing: {
                    id: selectedDosen.id,
                    nama: selectedDosen.nama,
                    gelar_depan: selectedDosen.gelar_depan ?? undefined,
                    gelar_belakang: selectedDosen.gelar_belakang ?? undefined,
                  },
                }
              : prev,
          );
        }

        setDosenId(null);
        setIsKonversi(false);

        // Dispatch event untuk invalidate cache di halaman lain (Kuota Dosen)
        window.dispatchEvent(new CustomEvent('kp-dospem-updated'));
      }
    } catch (error) {
      toast.error("Gagal mengupdate dosen pembimbing");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Mahasiswa", url: "/kerja-praktek/data-mahasiswa" },
          { name: "Update Dospem", url: "/kerja-praktek/update-dosbim" },
        ]}
        titleItems={[
          {
            title: "Update Dospem",
            subtitle: "Ubah dosen pembimbing mahasiswa dan batalkan ACC dosen jika diperlukan.",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-2 h-[calc(100vh-250px)]">
        <div className="border rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Daftar Mahasiswa</span>
          </div>

          <div className="px-3 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs">Mahasiswa</TableHead>
                  <TableHead className="text-xs">Dospem Saat Ini</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mhsLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : mhsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-sm text-muted-foreground">
                      Tidak ada mahasiswa ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  mhsList.map((m) => {
                    const dospemNama = getPembimbingLabel(m);
                    return (
                      <TableRow
                        key={m.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          selected?.id === m.id && "bg-primary/5 border-l-2 border-l-primary",
                        )}
                        onClick={() => {
                          setSelected(m);
                          setDosenId(null);
                          setIsKonversi(false);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={""} alt={m.nama ?? "Mahasiswa"} className="object-cover" />
                              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                {getInitials(m.nama ?? "M")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">{m.nama}</span>
                              <span className="text-xs text-muted-foreground">{m.nim}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {dospemNama ? (
                            <span className="text-sm">{dospemNama}</span>
                          ) : (
                            <span className="text-sm italic text-muted-foreground">Belum ada</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {(lastPage > 1 || mhsTotal > 0) && (
            <div className="border-t px-4 bg-white">
              <PaginationControls
                currentPage={page}
                lastPage={lastPage}
                total={mhsTotal}
                defaultLimit={MHS_LIMIT}
                onPageChange={(newPage) => setPage(newPage)}
                onLimitChange={() => {}}
              />
            </div>
          )}
        </div>

        <div className="space-y-4 flex flex-col">
          {selected ? (
            <div className="border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Ganti Dosen Pembimbing</span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/40">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={""} alt={selected.nama ?? "Mahasiswa"} className="object-cover" />
                      <AvatarFallback className="font-semibold bg-primary/10 text-primary">
                        {getInitials(selected.nama ?? "M")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{selected.nama}</span>
                        <Badge variant="outline" className="text-xs font-mono">
                          {selected.nim}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {getPembimbingLabel(selected) ?? (
                            <span className="italic">Belum ada dosen pembimbing</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">Pilih Dosen Pembimbing Baru</Label>
                    <Popover open={dosenOpen} onOpenChange={setDosenOpen} modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={dosenLoading || submitting}
                        >
                          {dosenLoading ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Memuat dosen...
                            </span>
                          ) : selectedDosen ? (
                            <span className="truncate">{getDosenLabel(selectedDosen)}</span>
                          ) : (
                            <span className="text-muted-foreground">Pilih dosen...</span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Cari nama dosen..."
                            value={dosenSearch}
                            onValueChange={setDosenSearch}
                          />
                          <CommandList>
                            <CommandEmpty>Dosen tidak ditemukan.</CommandEmpty>
                            <CommandGroup className="max-h-[220px] overflow-y-auto">
                              {filteredDosen.map((d) => (
                                <CommandItem
                                  key={d.id}
                                  value={String(d.id)}
                                  onSelect={() => {
                                    setDosenId(d.id);
                                    setDosenOpen(false);
                                    setDosenSearch("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 shrink-0",
                                      dosenId === d.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span className="truncate">{getDosenLabel(d)}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-muted/40 rounded-lg">
                    <Checkbox
                      id="is-konversi"
                      checked={isKonversi}
                      onCheckedChange={(checked) => setIsKonversi(checked === true)}
                    />
                    <Label htmlFor="is-konversi" className="cursor-pointer">Mahasiswa Konversi</Label>
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Button onClick={() => setConfirmOpen(true)} disabled={!dosenId || submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Menyimpan...
                        </>
                      ) : !selected.dosen_pembimbing ? (
                        "Tambah Dospem"
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setConfirmResetOpen(true)}
                      disabled={submitting || !selected.dosen_pembimbing}
                      className="w-full"
                    >
                      Reset Dospem
                    </Button>
                  </div>
                </div>
              </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] gap-3 border rounded-xl text-muted-foreground bg-muted/20">
              <UserCog className="w-10 h-10 opacity-30" />
              <div className="text-center">
                <p className="text-sm font-medium">Pilih mahasiswa terlebih dahulu</p>
                <p className="mt-0.5 text-xs">Klik salah satu baris di tabel kiri</p>
              </div>
            </div>
          )}

          <div className="border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Riwayat Perubahan Dospem</span>
              {riwayat.length > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {riwayat.length} entri
                </span>
              )}
            </div>
            <div className="overflow-auto max-h-[300px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs">Tanggal</TableHead>
                    <TableHead className="text-xs">Aktivitas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riwayatLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-16 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Memuat riwayat...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : riwayat.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-16 text-center text-sm text-muted-foreground italic">
                        Belum ada riwayat perubahan dospem
                      </TableCell>
                    </TableRow>
                  ) : (
                    riwayat.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-sm">{formatDate(r.created_at)}</TableCell>
                        <TableCell className="text-sm">{r.description}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selected?.dosen_pembimbing ? "Konfirmasi Perubahan Dosen Pembimbing" : "Konfirmasi Tambah Dosen Pembimbing"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selected?.dosen_pembimbing ? "Apakah Anda yakin ingin mengganti" : "Apakah Anda yakin ingin menambahkan"} dosen pembimbing untuk <span className="font-semibold text-foreground">{selected?.nama}</span> menjadi <span className="font-semibold text-foreground">{selectedDosen ? getDosenLabel(selectedDosen) : "-"}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                void applyDosen(dosenId);
              }}
            >
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Reset Dospem</AlertDialogTitle>
            <AlertDialogDescription>
              Dosen pembimbing untuk <span className="font-semibold text-foreground">{selected?.nama}</span> akan direset. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmResetOpen(false);
                void applyDosen(null);
              }}
            >
              Ya, Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAuth(UpdateDosbimClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);