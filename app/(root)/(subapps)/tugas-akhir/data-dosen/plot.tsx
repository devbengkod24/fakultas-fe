/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DosenService } from "@/api/tugas-akhir";
import EmptyState from "@/components/empty-state";
import { handleToastResponse } from "@/lib/toast-response";

interface Student {
  id: number;
  nim: string;
  name: string;
  email: string;
}

interface PlotStudentsDialogProps {
  dosen: {
    dosen_id: number;
    name: string;
    sisa_kuota: number;
    currentStudents: number;
    quota: number;
  };
  onPlotSuccess?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PlotStudentsDialog({
  dosen,
  onPlotSuccess,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: PlotStudentsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [internalIsDialogOpen, setInternalIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDialogOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsDialogOpen;

  const handleSetIsDialogOpen = (open: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(open);
    } else {
      setInternalIsDialogOpen(open);
    }
  };

  const { data, error, isLoading } = useSWR(
    isDialogOpen ? ["plot-mahasiswa", searchQuery] : null,
    () => DosenService.getListPlotMahasiswa(searchQuery).then((res) => res),
    { dedupingInterval: 300, revalidateOnFocus: false }
  );

  const students: Student[] = data?.data ?? [];

  const availableSlots = dosen.sisa_kuota;
  const selectedCount = selectedStudents.size;

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < availableSlots) {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAssign = async () => {
    if (selectedCount === 0) return;

    setIsSubmitting(true);
    try {
      const selectedStudentsList = students.filter((s) => selectedStudents.has(s.id));
      const payload = { mahasiswa_id: selectedStudentsList.map((s) => s.id) };

      const response = await DosenService.plotMahasiswa(dosen.dosen_id, payload);
      handleToastResponse(response);

      setSelectedStudents(new Set());
      handleSetIsDialogOpen(false);

      if (onPlotSuccess) {
        onPlotSuccess();
      }
    } catch (error: any) {
      console.error("Failed to plot students:", error);
      if (error.response?.data) {
        handleToastResponse(error.response.data);
      } else {
        toast.error("Gagal melakukan plotting mahasiswa", { description: "Silakan coba lagi." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    handleSetIsDialogOpen(open);
    if (!open) {
      setSearchQuery("");
      setSelectedStudents(new Set());
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      {externalIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-[0.5px] bg-primary-100/50 text-primary hover:text-primary hover:bg-primary-100/70 border-primary-300"
            disabled={dosen.currentStudents >= dosen.quota}
          >
            <Users className="size-4" />
            Plot Mahasiswa
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Plotting Mahasiswa ke Dosen</DialogTitle>
          <DialogDescription>
            <span>Pilih mahasiswa untuk diplot ke {dosen.name}</span>
            <br />
            <span className="font-medium">Sisa kuota dosen: {availableSlots}</span>
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center mb-4">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              placeholder="Cari berdasarkan NIM atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="border rounded-md max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40 rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          className="text-white"
                          checked={selectedStudents.has(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                          disabled={
                            !selectedStudents.has(student.id) &&
                            (selectedCount >= availableSlots || availableSlots <= 0)
                          }
                          aria-label={`Select ${student.name}`}
                        />
                      </TableCell>
                      <TableCell>{student.nim}</TableCell>
                      <TableCell>{student.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {error ? (
                        <EmptyState
                          icon={Users}
                          title="Gagal memuat data"
                          subtitle="Terjadi kesalahan saat mengambil data mahasiswa."
                          className="h-[200px]"
                        />
                      ) : searchQuery ? (
                        <EmptyState
                          icon={Users}
                          title="Tidak ada hasil"
                          subtitle="Tidak ada mahasiswa yang cocok dengan pencarian."
                          className="h-[200px]"
                        />
                      ) : (
                        <EmptyState
                          icon={Users}
                          title="Tidak ada mahasiswa"
                          subtitle="Semua mahasiswa aktif sudah memiliki dosen pembimbing."
                          className="h-[200px]"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            {selectedCount} mahasiswa terpilih dari {students.length} total
            {selectedCount > availableSlots && (
              <span className="text-destructive ml-2">(Melebihi kuota yang tersedia)</span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAssign}
            disabled={selectedCount === 0 || selectedCount > availableSlots || isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Plot Mahasiswa Dipilih"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
