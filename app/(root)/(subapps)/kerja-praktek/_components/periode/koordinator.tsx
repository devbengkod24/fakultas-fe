"use client"

import type React from "react"

import { useState } from "react"
import { RefreshCcw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SearchControl from "@/components/search-control"
import { PeriodeService } from "@/api/kerja-praktek"
import { toast } from "sonner"
import { handleToastResponse } from "@/lib/toast-response"
import useSWR from "swr"
import { Periode, PeriodeUpdate } from "@/types/kerja-praktek/periode"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation";
import { PeriodeSkeleton } from "./skeleton"

const fetcher = () => PeriodeService.getAllPeriode().then((res) => res.data);

export default function PeriodeKoordinator() {
  const {
    data: periodes,
    error,
    isLoading,
    mutate,
  } = useSWR("periode", fetcher);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() ?? "";

  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [editForm, setEditForm] = useState({
    tgl_awal: "",
    tgl_akhir: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await PeriodeService.syncPeriode();
      if (res.success && Array.isArray(res.data)) {
        mutate(res.data);
        handleToastResponse(res);
      } else {
        mutate();
        toast.info("Berhasil melakukan sinkronisasi data, tidak ada data baru");
      }
    } catch {
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEdit = (periode: Periode) => {
    setSelectedPeriode(periode);
    setEditForm({
      tgl_awal: periode.tgl_awal || "",
      tgl_akhir: periode.tgl_akhir || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPeriode(null);
    setEditForm({
      tgl_awal: "",
      tgl_akhir: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedPeriode) return;

    if (!editForm.tgl_awal || !editForm.tgl_akhir) {
      toast.error("Tanggal awal dan tanggal akhir harus diisi");
      return;
    }

    if (new Date(editForm.tgl_awal) >= new Date(editForm.tgl_akhir)) {
      toast.error("Tanggal awal harus lebih kecil dari tanggal akhir");
      return;
    }

    setIsUpdating(true);
    try {
      const updateData: PeriodeUpdate = {
        tgl_awal: editForm.tgl_awal,
        tgl_akhir: editForm.tgl_akhir,
        tahun_ajaran: selectedPeriode.tahun_ajaran,
        alokasi_kuota: selectedPeriode.alokasi_kuota || 0,
      };

      const res = await PeriodeService.updatePeriode(updateData, selectedPeriode.id);
      if (res.success) {
        mutate();
        handleToastResponse(res);
        handleCloseModal();
      } else {
        toast.error("Gagal memperbarui periode");
      }
    } catch {
      toast.error("Gagal memperbarui periode");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: "tgl_awal" | "tgl_akhir", value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (error) {
    return <div>Error: Failed to fetch periode</div>;
  }

  const filteredPeriodes = (periodes ?? []).filter((periode: Periode) =>
    String(periode.kode_periode).toLowerCase().includes(searchTerm.toLowerCase()) ||
    periode.tahun_ajaran.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchControl placeholder="Cari periode..." className="w-1/4"/>
          <Button size="default" onClick={handleSyncData} disabled={isSyncing}>
            <RefreshCcw
              className={`size-4 ${isSyncing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Tabel dengan loading state terpisah */}
        {isLoading ? (
          <PeriodeSkeleton />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Kode Periode</TableHead>
                  <TableHead>Tahun Ajaran</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Berakhir</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPeriodes.map((periode: Periode, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{periode.kode_periode}</TableCell>
                    <TableCell>{periode.tahun_ajaran}</TableCell>
                    <TableCell>{periode.tgl_awal}</TableCell>
                    <TableCell>{periode.tgl_akhir}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          periode.status === 1 ? "success" : "destructiveOutline"
                        }
                      >
                        {periode.status === 1 ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(periode)}
                      >
                        <Edit className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Periode</DialogTitle>
            <DialogDescription>
              {selectedPeriode?.tahun_ajaran}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tgl_awal" className="text-right">
                Tanggal Awal
              </Label>
              <Input
                id="tgl_awal"
                type="date"
                value={editForm.tgl_awal}
                onChange={(e) => handleInputChange("tgl_awal", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tgl_akhir" className="text-right">
                Tanggal Akhir
              </Label>
              <Input
                id="tgl_akhir"
                type="date"
                value={editForm.tgl_akhir}
                onChange={(e) => handleInputChange("tgl_akhir", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isUpdating}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating}>
              {isUpdating ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
