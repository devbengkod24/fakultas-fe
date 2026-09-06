"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import useSWR, { mutate } from "swr";
import { DosenService, MahasiswaServiceV2 } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";

interface MahasiswaBimbingan {
  mahasiswa_id: number;
  nim: string;
  name: string;
  jml_bimbingan: number;
  bab_terakhir: number | null;
  status: string;
  status_sidang_ta2: string;
  status_sidang_ta1: string;
  ta1: string;
  ta2: string;
}

interface DosenData {
  dosen_id: number;
  npp: string;
  name: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  sisa_kuota: number;
}

interface MahasiswaBimbinganTableProps {
  dosenId: string;
}

function UbahDospemDialog({
  mahasiswa,
  onClose,
  onSuccess,
}: {
  mahasiswa: MahasiswaBimbingan;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedDosenId, setSelectedDosenId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dosenResponse, isLoading: dosenLoading } = useSWR(
    "dosen-list-ubah-dospem",
    () => DosenService.getAll(1, 1000, "", "", "").then((r) => r.data),
    { revalidateOnFocus: false },
  );

  const dosenList: DosenData[] = dosenResponse ?? [];
  const filtered = dosenList.filter((d) => {
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.npp?.toLowerCase().includes(q);
  });

  const getDosenName = (d: DosenData) =>
    `${d.gelar_depan ? d.gelar_depan + " " : ""}${d.name}${d.gelar_belakang ? ", " + d.gelar_belakang : ""}`;

  const selectedDosen = dosenList.find((d) => d.dosen_id === selectedDosenId);

  const handleSubmit = async () => {
    if (!selectedDosenId) return;
    setIsSubmitting(true);
    try {
      const res = await MahasiswaServiceV2.updateDospem({
        mahasiswa_id: [mahasiswa.mahasiswa_id],
        dosen_id: selectedDosenId,
      });
      handleToastResponse(res, () => {
        onSuccess();
        onClose();
      });
    } catch {
      toast.error("Gagal mengubah dosen pembimbing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ubah Dosen Pembimbing</DialogTitle>
          <DialogDescription>
            Mahasiswa: <span className="font-medium">{mahasiswa.name}</span> (
            {mahasiswa.nim})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label>Dosen Pembimbing Baru</Label>
          <Popover open={isOpen} onOpenChange={setIsOpen} modal>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={dosenLoading}
              >
                {selectedDosen
                  ? getDosenName(selectedDosen)
                  : "Pilih Dosen Pembimbing"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Cari dosen..."
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandList>
                  <CommandEmpty>Dosen tidak ditemukan.</CommandEmpty>
                  <CommandGroup className="max-h-[240px] overflow-y-auto">
                    {filtered.map((d) => (
                      <CommandItem
                        key={d.dosen_id}
                        value={String(d.dosen_id)}
                        onSelect={() => {
                          setSelectedDosenId(d.dosen_id);
                          setIsOpen(false);
                          setSearch("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDosenId === d.dosen_id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{getDosenName(d)}</span>
                          <span className="text-xs text-muted-foreground">
                            {d.npp} · sisa kuota: {d.sisa_kuota}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDosenId || isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MahasiswaBimbinganTable({
  dosenId,
}: MahasiswaBimbinganTableProps) {
  const [ubahTarget, setUbahTarget] = useState<MahasiswaBimbingan | null>(null);
  const swrKey = `mahasiswa-bimbingan-${dosenId}`;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(swrKey, () => DosenService.getMahasiswaBimbingan(Number(dosenId)));

  const data: MahasiswaBimbingan[] = response?.data || [];
  const pagination = response?.meta
    ? {
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        limit: response.meta.per_page,
        total: response.meta.total,
      }
    : undefined;

  if (error) console.error("Error fetching mahasiswa bimbingan:", error);

  const columns: ColumnDef<MahasiswaBimbingan>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "nim",
      header: "NIM",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "ta1",
      header: "TA 1",
      cell: ({ row }) => {
        const ta1 = row.getValue("ta1") as string;
        return (
          <Badge
            variant={
              ta1 === "LULUS"
                ? "success"
                : ta1 === "PROSES"
                  ? "primary"
                  : "outline"
            }
          >
            {ta1}
          </Badge>
        );
      },
    },
    {
      accessorKey: "ta2",
      header: "TA 2",
      cell: ({ row }) => {
        const ta2 = row.getValue("ta2") as string;
        return (
          <Badge
            variant={
              ta2 === "LULUS"
                ? "success"
                : ta2 === "PROSES"
                  ? "primary"
                  : "outline"
            }
          >
            {ta2}
          </Badge>
        );
      },
    },
    {
      accessorKey: "bab_terakhir",
      header: "Bab Terakhir",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("bab_terakhir") ?? "-"}</div>
      ),
    },
    {
      accessorKey: "jml_bimbingan",
      header: "Jumlah Bimbingan",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("jml_bimbingan")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "accepted" ? "success" : "secondary"}>
            {status === "accepted" ? "ACC" : status.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status_sidang_ta1",
      header: "Sidang TA 1",
    },
    {
      accessorKey: "status_sidang_ta2",
      header: "Sidang TA 2",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUbahTarget(row.original)}
          className="flex items-center gap-1.5"
        >
          <UserCog className="h-3.5 w-3.5" />
          Ubah Dospem
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Mahasiswa Bimbingan</CardTitle>
          <CardDescription>
            Daftar mahasiswa bimbingan yang sedang berjalan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            loading={isLoading}
            pagination={pagination}
          />
        </CardContent>
      </Card>

      {ubahTarget && (
        <UbahDospemDialog
          mahasiswa={ubahTarget}
          onClose={() => setUbahTarget(null)}
          onSuccess={() => mutate(swrKey)}
        />
      )}
    </>
  );
}
