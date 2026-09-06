"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from "lucide-react";
import { DosenService } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";

interface Dosen {
  dosen_id: number;
  npp: string;
  name: string;
  gelar_depan?: string;
  gelar_belakang?: string;
  email: string;
  bidang_kajian?: string;
  aktif_periode: boolean;
}

interface BulkActivateModalProps {
  open: boolean;
  onClose: () => void;
  mutateKey: (string | number)[];
}

const dosenFetcher = () =>
  DosenService.getAll(1, 1000, "", "nonaktif", "").then((res) => res.data);

export function BulkActivateModal({
  open,
  onClose,
  mutateKey,
}: BulkActivateModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dosenResponse, isLoading: dosenLoading } = useSWR(
    open ? "dosen-nonaktif-list" : null,
    dosenFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const dosenList: Dosen[] = dosenResponse ?? [];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setDebouncedSearch("");
      setSelectedIds([]);
    }
  }, [open]);

  // Filter dosen by search term
  const filteredDosen = dosenList.filter((dosen) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    const fullName = getDosenDisplayName(dosen).toLowerCase();
    const nppMatch = dosen.npp?.toLowerCase().includes(searchLower) ?? false;
    return fullName.includes(searchLower) || nppMatch;
  });

  function getDosenDisplayName(dosen: Dosen): string {
    const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
    const name = dosen.name ?? "";
    const gelarBelakang = dosen.gelar_belakang
      ? `, ${dosen.gelar_belakang}`
      : "";
    return `${gelarDepan}${name}${gelarBelakang}`;
  }

  const handleCheckboxChange = (dosenId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(dosenId)) {
        return prev.filter((id) => id !== dosenId);
      } else {
        return [...prev, dosenId];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredDosen.map((d) => d.dosen_id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected =
    filteredDosen.length > 0 && selectedIds.length === filteredDosen.length;

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu dosen");
      return;
    }

    setIsSubmitting(true);

    try {
      let successCount = 0;
      let failCount = 0;

      for (const dosenId of selectedIds) {
        try {
          const response = await DosenService.toggleAktifPeriode(dosenId);
          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} dosen berhasil diaktifkan`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} dosen gagal diaktifkan`);
      }

      // Refresh the main dosen list
      mutate(mutateKey);
      // Also refresh the nonaktif list for next open
      mutate("dosen-nonaktif-list");

      onClose();
    } catch {
      toast.error("Terjadi kesalahan saat mengaktifkan dosen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Aktifkan Banyak Dosen</DialogTitle>
          <DialogDescription>
            Pilih dosen yang akan diaktifkan untuk periode ini. Hanya dosen
            nonaktif yang ditampilkan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Cari dosen (Nama atau NPP)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="border rounded-md max-h-[350px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={filteredDosen.length === 0}
                    />
                  </TableHead>
                  <TableHead>NPP</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredDosen.length > 0 ? (
                  filteredDosen.map((dosen) => (
                    <TableRow key={dosen.dosen_id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(dosen.dosen_id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(dosen.dosen_id)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {dosen.npp}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getDosenDisplayName(dosen)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dosen.email}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {dosenList.length === 0
                        ? "Semua dosen sudah aktif"
                        : "Tidak ada dosen ditemukan"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {selectedIds.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} dosen dipilih
            </p>
          )}
        </div>

        <DialogFooter className="p-6 pt-2 border-t mt-auto">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Aktifkan{" "}
                {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
