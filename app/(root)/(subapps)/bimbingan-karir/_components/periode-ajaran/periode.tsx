"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw,
  AlertCircle,
  Calendar as CalendarIcon,
  Edit,
} from "lucide-react";
import EmptyState from "@/components/empty-state";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR from "swr";
import { PeriodeService } from "@/api/bimbingan-karir";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Periode = {
  id: number;
  kode_periode: number;
  tahun_ajaran: string;
  tgl_awal: string | null;
  tgl_akhir: string | null;
  tgl_awal_bk: string | null;
  tgl_akhir_bk: string | null;
  status: number;
};

type ApiResponse = {
  data: Periode[];
  meta: {
    success: boolean;
    message: string;
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
};

const fetcher = (): Promise<ApiResponse> => PeriodeService.getAllPeriode();

// Zod schema for form validation
const editPeriodeSchema = z
  .object({
    tgl_awal_bk: z.date({
      required_error: "Tanggal mulai BK harus diisi",
    }),
    tgl_akhir_bk: z.date({
      required_error: "Tanggal akhir BK harus diisi",
    }),
  })
  .refine(
    (data) => {
      return data.tgl_awal_bk < data.tgl_akhir_bk;
    },
    {
      message: "Tanggal mulai harus lebih awal dari tanggal akhir",
      path: ["tgl_akhir_bk"],
    }
  );

type EditPeriodeFormData = z.infer<typeof editPeriodeSchema>;

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return dayjs(dateString).locale("id").format("DD MMM YYYY");
};

const parseStringToDate = (dateString: string | null) => {
  if (!dateString) return undefined;
  return new Date(dateString);
};

const formatDateToString = (date: Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

const EditPeriodeModal = ({
  periode,
  isOpen,
  onClose,
  onSuccess,
}: {
  periode: Periode | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditPeriodeFormData>({
    resolver: zodResolver(editPeriodeSchema),
    defaultValues: {
      tgl_awal_bk: undefined,
      tgl_akhir_bk: undefined,
    },
  });

  // Update form data when periode changes
  useEffect(() => {
    if (periode) {
      form.reset({
        tgl_awal_bk: parseStringToDate(periode.tgl_awal_bk),
        tgl_akhir_bk: parseStringToDate(periode.tgl_akhir_bk),
      });
    }
  }, [periode, form]);

  const onSubmit = async (data: EditPeriodeFormData) => {
    if (!periode) return;

    setIsLoading(true);
    try {
      const res = await PeriodeService.update(periode.id, {
        tgl_awal_bk: formatDateToString(data.tgl_awal_bk),
        tgl_akhir_bk: formatDateToString(data.tgl_akhir_bk),
      });

      handleToastResponse(res);
      onSuccess();
      onClose();
      form.reset();
    } catch {
      toast.error("Gagal mengupdate periode");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Periode Bimbingan Karir</DialogTitle>
          <DialogDescription>
            Update tanggal periode bimbingan karir untuk {periode?.tahun_ajaran}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tgl_awal_bk"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Mulai BK</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            dayjs(field.value)
                              .locale("id")
                              .format("DD MMMM YYYY")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value || new Date()}
                        disabled={(date) =>
                          date < new Date("1900-01-01") || isLoading
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tgl_akhir_bk"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Akhir BK</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            dayjs(field.value)
                              .locale("id")
                              .format("DD MMMM YYYY")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value || new Date()}
                        disabled={(date) =>
                          date < new Date("1900-01-01") || isLoading
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const columns: ColumnDef<Periode>[] = [
  {
    accessorKey: "kode_periode",
    header: "Kode Periode",
  },
  {
    accessorKey: "tahun_ajaran",
    header: "Tahun Ajaran",
  },
  {
    accessorKey: "tgl_awal_bk",
    header: "Tanggal Mulai BK",
    cell: ({ row }) => formatDate(row.getValue("tgl_awal_bk")),
  },
  {
    accessorKey: "tgl_akhir_bk",
    header: "Tanggal Akhir BK",
    cell: ({ row }) => formatDate(row.getValue("tgl_akhir_bk")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as number;
      return (
        <Badge variant={status === 1 ? "success" : "destructiveOutline"}>
          {status === 1 ? "Aktif" : "Nonaktif"}
        </Badge>
      );
    },
  },
];

const createColumnsWithActions = (
  onEdit: (periode: Periode) => void,
): ColumnDef<Periode>[] => [
    ...columns,
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const periode = row.original;

        return (
          <Button variant="ghost" onClick={() => onEdit(periode)}>
            <Edit className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

const PeriodeTable = () => {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR("periode", fetcher);

  const [isSyncing, setIsSyncing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleEdit = (periode: Periode) => {
    setSelectedPeriode(periode);
    setEditModalOpen(true);
  };


  const handleEditSuccess = () => {
    mutate(); // Refresh data after successful edit
  };

  const columnsWithActions = createColumnsWithActions(handleEdit);

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await PeriodeService.syncPeriode();
      if (res.data && Array.isArray(res.data)) {
        mutate();
        handleToastResponse(res);
      } else {
        mutate();
        toast.success("Berhasil melakukan sinkronisasi data");
      }
    } catch {
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  const allPeriodes = response?.data || [];
  const periodes = allPeriodes.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status.toString() === statusFilter;
  });
  const pagination = response?.meta?.pagination;

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data periode. Silakan coba lagi."
        button={
          <Button onClick={() => mutate()} variant="outline">
            <RefreshCcw className="size-4 mr-2" />
            Coba Lagi
          </Button>
        }
      />
    );
  }

  if (!isLoading && allPeriodes.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <Button size="sm" onClick={handleSyncData} disabled={isSyncing}>
            <RefreshCcw
              className={`size-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Sinkronisasi..." : "Sync Data"}
          </Button>
        </div>
        <EmptyState
          icon={CalendarIcon}
          title="Belum ada data periode"
          subtitle="Silakan lakukan sinkronisasi data untuk mengambil periode terbaru."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button size="sm" onClick={handleSyncData} disabled={isSyncing}>
          <RefreshCcw className={`size-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Sinkronisasi..." : "Sync Data"}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="1">Aktif</SelectItem>
              <SelectItem value="0">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={columnsWithActions}
        data={periodes}
        loading={isLoading}
        pagination={
          pagination
            ? {
              currentPage: pagination.current_page,
              lastPage: pagination.last_page,
              limit: pagination.per_page,
              total: pagination.total,
            }
            : undefined
        }
      />

      <EditPeriodeModal
        periode={selectedPeriode}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default PeriodeTable;
