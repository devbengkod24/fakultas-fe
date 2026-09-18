/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Edit,
  MoreHorizontal,
  RefreshCcw,
  ToggleRight,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { toast } from "sonner";
import { PeriodeFakultasService } from "@/api/fakultas";
import { FakultasSyncService } from "@/api";
import SearchControl from "@/components/search-control";
import { handleToastResponse } from "@/lib/toast-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import "dayjs/locale/id";

interface Periode {
  id: number;
  kode_periode: string | number;
  tahun_ajaran: string;
  tgl_awal: string | null;
  tgl_akhir: string | null;
  tgl_awal_ta: string | null;
  tgl_akhir_ta: string | null;
  tgl_awal_bk: string | null;
  tgl_akhir_bk: string | null;
  status: boolean | number;
}

const editPeriodeSchema = z
  .object({
    tgl_awal: z.date({ required_error: "Tanggal mulai harus diisi" }),
    tgl_akhir: z.date({ required_error: "Tanggal akhir harus diisi" }),
    tgl_awal_ta: z.date({ required_error: "Tanggal mulai TA harus diisi" }),
    tgl_akhir_ta: z.date({ required_error: "Tanggal akhir TA harus diisi" }),
    tgl_awal_bk: z.date({ required_error: "Tanggal mulai BK harus diisi" }),
    tgl_akhir_bk: z.date({ required_error: "Tanggal akhir BK harus diisi" }),
    status: z.boolean(),
  })
  .refine((data) => data.tgl_awal < data.tgl_akhir, {
    message: "Tanggal mulai harus lebih awal dari tanggal akhir",
    path: ["tgl_akhir"],
  })
  .refine((data) => data.tgl_awal_ta < data.tgl_akhir_ta, {
    message: "Tanggal mulai TA harus lebih awal dari tanggal akhir TA",
    path: ["tgl_akhir_ta"],
  })
  .refine((data) => data.tgl_awal_bk < data.tgl_akhir_bk, {
    message: "Tanggal mulai BK harus lebih awal dari tanggal akhir BK",
    path: ["tgl_akhir_bk"],
  });

type EditPeriodeFormData = z.infer<typeof editPeriodeSchema>;

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
      tgl_awal: undefined,
      tgl_akhir: undefined,
      tgl_awal_ta: undefined,
      tgl_akhir_ta: undefined,
      tgl_awal_bk: undefined,
      tgl_akhir_bk: undefined,
      status: true,
    },
  });

  useEffect(() => {
    if (periode) {
      form.reset({
        tgl_awal: periode.tgl_awal ? new Date(periode.tgl_awal) : undefined,
        tgl_akhir: periode.tgl_akhir ? new Date(periode.tgl_akhir) : undefined,
        tgl_awal_ta: periode.tgl_awal_ta ? new Date(periode.tgl_awal_ta) : undefined,
        tgl_akhir_ta: periode.tgl_akhir_ta ? new Date(periode.tgl_akhir_ta) : undefined,
        tgl_awal_bk: periode.tgl_awal_bk ? new Date(periode.tgl_awal_bk) : undefined,
        tgl_akhir_bk: periode.tgl_akhir_bk ? new Date(periode.tgl_akhir_bk) : undefined,
        status: periode.status === 1 || periode.status === true,
      });
    }
  }, [periode, form]);

  const onSubmit = async (data: EditPeriodeFormData) => {
    if (!periode) return;

    setIsLoading(true);
    try {
      const res = await PeriodeFakultasService.update(periode.id, {
        tgl_awal: formatDateToString(data.tgl_awal),
        tgl_akhir: formatDateToString(data.tgl_akhir),
        tgl_awal_ta: formatDateToString(data.tgl_awal_ta),
        tgl_akhir_ta: formatDateToString(data.tgl_akhir_ta),
        tgl_awal_bk: formatDateToString(data.tgl_awal_bk),
        tgl_akhir_bk: formatDateToString(data.tgl_akhir_bk),
        status: data.status ? 1 : 0,
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Periode</DialogTitle>
          <DialogDescription>
            Update tanggal periode untuk {periode?.tahun_ajaran}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tgl_awal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Mulai</FormLabel>
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
                            dayjs(field.value).locale("id").format("DD MMMM YYYY")
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
                        disabled={(date) => date < new Date("1900-01-01") || isLoading}
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
              name="tgl_akhir"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Akhir</FormLabel>
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
                            dayjs(field.value).locale("id").format("DD MMMM YYYY")
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
                        disabled={(date) => date < new Date("1900-01-01") || isLoading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Tanggal Tugas Akhir (TA)</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="tgl_awal_ta"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs">Mulai TA</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-9",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                dayjs(field.value).locale("id").format("DD MMM YYYY")
                              ) : (
                                <span>Pilih</span>
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
                            disabled={(date) => date < new Date("1900-01-01") || isLoading}
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
                  name="tgl_akhir_ta"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs">Akhir TA</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-9",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                dayjs(field.value).locale("id").format("DD MMM YYYY")
                              ) : (
                                <span>Pilih</span>
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
                            disabled={(date) => date < new Date("1900-01-01") || isLoading}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Tanggal Bimbingan Karir (BK)</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="tgl_awal_bk"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs">Mulai BK</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-9",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                dayjs(field.value).locale("id").format("DD MMM YYYY")
                              ) : (
                                <span>Pilih</span>
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
                            disabled={(date) => date < new Date("1900-01-01") || isLoading}
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
                      <FormLabel className="text-xs">Akhir BK</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-9",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                dayjs(field.value).locale("id").format("DD MMM YYYY")
                              ) : (
                                <span>Pilih</span>
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
                            disabled={(date) => date < new Date("1900-01-01") || isLoading}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Aktif</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {field.value ? "Periode sedang aktif" : "Periode tidak aktif"}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
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

const fetcher = (
  page: number,
  limit: number,
  search: string,
  status: string,
) =>
  PeriodeFakultasService.getAll(
    page,
    limit,
    search,
    undefined,
    status && status !== "all" ? status : undefined
  ).then((res) => res);

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return dayjs(dateString).locale("id").format("DD MMMM YYYY");
};

export default function TableSyncPeriode() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const filter_status = searchParams.get("status") || "all";

  const [isSyncing, setIsSyncing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);

  const handleEdit = (periode: Periode) => {
    setSelectedPeriode(periode);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    mutate(mutateKey);
  };

  const handleChangeStatus = async (periode: Periode) => {
    try {
      const res = await PeriodeFakultasService.changeStatus(periode.id);
      handleToastResponse(res);
      mutate(mutateKey);
    } catch {
      toast.error("Gagal mengubah status periode");
    }
  };

  const mutateKey = ["periode-list", page, limit, search, filter_status];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    mutateKey,
    () => fetcher(page, limit, search, filter_status),
    { dedupingInterval: 1000 }
  );

  const rawPeriodes = response?.data?.data ?? response?.data ?? [];
  const periodes: Periode[] = Array.isArray(rawPeriodes) ? rawPeriodes : [];
  
  const pagination = response?.data?.meta?.pagination ?? response?.meta?.pagination;
  const lastPages = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncPeriode();
      mutate(mutateKey);
      if (res?.success === false) {
        toast.error(res.message || "Gagal sinkronisasi data periode");
      } else {
        handleToastResponse(res);
      }
    } catch (error: any) {
      toast.error("Gagal melakukan sinkronisasi data periode");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const columns: ColumnDef<Periode>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "kode_periode",
      header: "Kode Periode",
    },
    {
      accessorKey: "tahun_ajaran",
      header: "Tahun Ajaran",
    },
    {
      accessorKey: "tgl_awal",
      header: "Tanggal Mulai",
      cell: ({ row }) => formatDate(row.getValue("tgl_awal")),
    },
    {
      accessorKey: "tgl_akhir",
      header: "Tanggal Selesai",
      cell: ({ row }) => formatDate(row.getValue("tgl_akhir")),
    },
    {
      accessorKey: "tgl_awal_ta",
      header: "Mulai TA",
      cell: ({ row }) => formatDate(row.getValue("tgl_awal_ta")),
    },
    {
      accessorKey: "tgl_akhir_ta",
      header: "Akhir TA",
      cell: ({ row }) => formatDate(row.getValue("tgl_akhir_ta")),
    },
    {
      accessorKey: "tgl_awal_bk",
      header: "Mulai BK",
      cell: ({ row }) => formatDate(row.getValue("tgl_awal_bk")),
    },
    {
      accessorKey: "tgl_akhir_bk",
      header: "Akhir BK",
      cell: ({ row }) => formatDate(row.getValue("tgl_akhir_bk")),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const periode = row.original;
        const isActive = periode.status === 1 || periode.status === true;
        return (
          <Badge variant={isActive ? "blue" : "destructiveOutline"}>
            {isActive ? "Aktif" : "Tidak aktif"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const periode = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(periode)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Periode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeStatus(periode)}>
                <ToggleRight className="mr-2 h-4 w-4" />
                {periode.status === 1 || periode.status === true ? "Nonaktifkan" : "Aktifkan"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data periode. Silakan coba lagi."
        button={<Button onClick={() => router.refresh()}>Coba Lagi</Button>}
      />
    );
  }

  const hasData = periodes && periodes.length > 0;

  return (
    <>
      <div className="gap-4 flex flex-col">
        {/* Filters */}
        <div className="flex justify-between items-center gap-2 w-full">
          <SearchControl placeholder="Cari periode..." className="w-1/4" />
          <div className="flex items-center gap-2">
            <Select
              value={filter_status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[180px] h-9 text-xs font-normal">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
                <SelectItem value="1" className="text-xs">Aktif</SelectItem>
                <SelectItem value="0" className="text-xs">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSync}
              variant="default"
              className="h-9"
              disabled={isSyncing}
            >
              <RefreshCcw
                className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync Data
            </Button>
          </div>
        </div>
      </div>

      {!isLoading && !hasData ? (
        <EmptyState
          icon={CalendarIcon}
          title="Belum ada data periode"
          subtitle="Belum ada periode yang terdaftar pada sistem."
          className="h-[400px]"
        />
      ) : (
        <DataTable
          columns={columns}
          data={periodes}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: lastPages,
            limit: limit,
            total: totalData,
          }}
        />
      )}

      <EditPeriodeModal
        periode={selectedPeriode}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
