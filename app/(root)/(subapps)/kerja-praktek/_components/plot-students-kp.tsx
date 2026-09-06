"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import EmptyState from "@/components/empty-state";
import { MahasiswaService } from "@/api/kerja-praktek";
import { handleToastResponse } from "@/lib/toast-response";
import { useProfile } from "@/context/profileUseContext";

interface Student {
  id: number;
  nim: string;
  nama: string;
  project_id?: number | null;
}

interface PlotStudentsKPProps {
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

export default function PlotStudentsKP({
  dosen,
  onPlotSuccess,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: PlotStudentsKPProps) {
  const { activeProdiId } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [internalIsDialogOpen, setInternalIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKonversi, setIsKonversi] = useState(false);

  const isDialogOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsDialogOpen;

  const handleSetIsDialogOpen = (open: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(open);
    } else {
      setInternalIsDialogOpen(open);
    }
  };

  const { data, error, isLoading } = useSWR(
    isDialogOpen ? ["kp-plot-mahasiswa", searchQuery, activeProdiId ?? undefined] : null,
    () => MahasiswaService.getAllMahasiswa(1, 500, searchQuery, undefined, undefined, activeProdiId ?? undefined).then((res) => res),
    { dedupingInterval: 300, revalidateOnFocus: false }
  );

  const allStudents: any[] = data?.data ?? [];

  // Filter: only students that have NO dosen_pembimbing assigned
  const students = allStudents.filter((s) => {
    return !s.dosen_pembimbing;
  }).map((s) => ({
    id: s.id,
    nim: s.nim,
    nama: s.nama,
    project_id: s.project_id,
  })) as Student[];

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
      const selectedProjectIds = allStudents
        .filter((s: any) => selectedStudents.has(s.id))
        .map((s: any) => s.project_id)
        .filter(Boolean);

      if (selectedProjectIds.length === 0) {
        toast.error("Gagal: Tidak ada project_id yang valid");
        return;
      }

      const response = await MahasiswaService.updateDospem(selectedProjectIds, dosen.dosen_id, isKonversi);
      handleToastResponse(response);

      setSelectedStudents(new Set());
      handleSetIsDialogOpen(false);

      if (onPlotSuccess) onPlotSuccess();

      // Dispatch event untuk invalidate cache di halaman lain (Kuota Dosen)
      window.dispatchEvent(new CustomEvent('kp-dospem-updated'));
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal melakukan plotting mahasiswa");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    handleSetIsDialogOpen(open);
    if (!open) {
      setSearchQuery("");
      setSelectedStudents(new Set());
      setIsKonversi(false);
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
          <div>
            <div className="text-sm">Pilih mahasiswa untuk diplot ke {dosen.name}</div>
            <div className="font-medium">Sisa kuota dosen: {availableSlots}</div>
          </div>
        </DialogHeader>

        <div>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                placeholder="Cari berdasarkan NIM atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is-konversi"
                checked={isKonversi}
                onCheckedChange={(checked) => setIsKonversi(checked === true)}
              />
              <Label htmlFor="is-konversi" className="text-sm font-normal cursor-pointer">
                Konversi
              </Label>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              Error loading data: {error?.message || "Unknown error"}
            </div>
          )}

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
                          checked={selectedStudents.has(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                          disabled={
                            !selectedStudents.has(student.id) &&
                            (selectedCount >= availableSlots || availableSlots <= 0)
                          }
                          aria-label={`Select ${student.nama}`}
                        />
                      </TableCell>
                      <TableCell>{student.nim}</TableCell>
                      <TableCell>{student.nama}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <EmptyState
                        icon={Users}
                        title="Semua mahasiswa sudah punya dospem"
                        subtitle="Tidak ada mahasiswa KP yang belum memiliki dosen pembimbing"
                        className="h-[200px]"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            {selectedCount} mahasiswa terpilih dari {students.length} total
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