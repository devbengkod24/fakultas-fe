"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Calendar, ChevronDown, FileText, Check, X, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmptyState from "@/components/empty-state";
import { handleToastResponse } from "@/lib/toast-response";
import { cn } from "@/lib/utils";

dayjs.locale("id");

const editFormSchema = z.object({
  uraian: z.string().min(10, "Uraian minimal 10 karakter"),
  bab: z.number().min(1, "Pilih bab").max(5, "Bab maksimal 5"),
  tanggal: z.date({
    required_error: "Tanggal tidak boleh kosong",
  }),
  dokumen: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .or(z.string().url("URL dokumen tidak valid")),
});

type EditFormData = z.infer<typeof editFormSchema>;

export interface LogbookEntry {
  id: number;
  tanggal: string;
  uraian: string;
  bab: number;
  status: "pending" | "accepted" | "revised";
  dokumen: string | null;
}

export interface UpdateLogbookData {
  uraian: string;
  bab: number;
  tanggal: string;
  dokumen: string | null;
}

interface LogbookTimelineViewProps {
  entries: LogbookEntry[];
  onStatusChange?: (
    logbookId: number,
    status: "pending" | "accepted" | "revised"
  ) => void;
  onUpdate?: () => void;
  onUpdateLogbook: (id: number, data: UpdateLogbookData) => Promise<unknown>;
  role?: string;
  maxBab?: number;
}

export function LogbookTimelineView({
  entries,
  onStatusChange,
  onUpdate,
  onUpdateLogbook,
  role,
  maxBab = 5,
}: LogbookTimelineViewProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntry | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"accepted" | "revised">(
    "accepted"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDosen = role === "dosen" || role === "koordinator" || role === "super_fakultas";
  const isMahasiswa = role === "mahasiswa";

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      uraian: "",
      bab: undefined,
      tanggal: new Date(),
      dokumen: "",
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success">Diterima</Badge>;
      case "revised":
        return <Badge variant="destructiveOutline">Perlu Revisi</Badge>;
      default:
        return <Badge variant="secondary">Menunggu</Badge>;
    }
  };

  const handleStatusClick = (
    entry: LogbookEntry,
    status: "accepted" | "revised"
  ) => {
    setSelectedEntry(entry);
    setSelectedStatus(status);
    setAlertOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedEntry && onStatusChange) {
      onStatusChange(selectedEntry.id, selectedStatus);
      setAlertOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleEditClick = (entry: LogbookEntry) => {
    setSelectedEntry(entry);
    editForm.reset({
      uraian: entry.uraian,
      bab: entry.bab,
      tanggal: new Date(entry.tanggal),
      dokumen: entry.dokumen || "",
    });
    setEditModalOpen(true);
  };

  const handleUpdateLogbook = async (data: EditFormData) => {
    if (!selectedEntry) return;

    try {
      setIsSubmitting(true);
      const response = await onUpdateLogbook(selectedEntry.id, {
        uraian: data.uraian,
        bab: data.bab,
        tanggal: format(data.tanggal, "yyyy-MM-dd"),
        dokumen: data.dokumen || null,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleToastResponse(response as any, () => {
        setEditModalOpen(false);
        setSelectedEntry(null);
        onUpdate?.();
      });
    } catch {
      handleToastResponse({
        success: false,
        message: "Gagal mengupdate logbook. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={isMahasiswa ? "Belum Ada Logbook Bimbingan" : "Belum Ada Logbook"}
        subtitle={
          isMahasiswa
            ? "Mulai membuat logbook bimbingan pertama Anda dengan mengklik tombol 'Buat Logbook Baru'"
            : "Mahasiswa belum membuat logbook bimbingan."
        }
        className="h-[400px]"
      />
    );
  }

  const entriesByChapter: Record<number, LogbookEntry[]> = {};
  entries.forEach((entry) => {
    if (!entriesByChapter[entry.bab]) {
      entriesByChapter[entry.bab] = [];
    }
    entriesByChapter[entry.bab].push(entry);
  });

  const sortedChapters = Object.keys(entriesByChapter)
    .map(Number)
    .sort((a, b) => a - b);

  Object.keys(entriesByChapter).forEach((chapter) => {
    entriesByChapter[Number(chapter)].sort(
      (a, b) => dayjs(b.tanggal).valueOf() - dayjs(a.tanggal).valueOf()
    );
  });

  const babOptions = Array.from({ length: maxBab }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {sortedChapters.map((chapter, chapterIndex) => {
        const chapterEntries = entriesByChapter[chapter];
        const latestEntry = chapterEntries[0];

        return (
          <div key={chapter} className="relative">
            {chapterIndex < sortedChapters.length - 1 && (
              <div className="absolute left-5 top-10 bottom-[-32px] w-[0.5px] bg-muted-foreground/20" />
            )}

            <Collapsible defaultOpen>
              <div className="flex gap-4">
                <div className="flex-shrink-0 size-10 rounded-full bg-primary-100 flex items-center justify-center z-10 border border-primary-200">
                  <span className="text-sm font-medium text-primary">
                    {chapter}
                  </span>
                </div>

                <div className="flex-1 bg-card rounded-lg border shadow-none">
                  <CollapsibleTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-muted/50 rounded-t-lg flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            Bimbingan Bab {chapter}
                          </h3>
                          {getStatusBadge(latestEntry.status)}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          Terakhir:{" "}
                          {dayjs(latestEntry.tanggal).format("D MMMM YYYY")}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {chapterEntries.length}x bimbingan
                        </p>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t">
                      {chapterEntries.map((entry, entryIndex) => (
                        <div
                          key={entry.id}
                          className={`p-4 ${
                            entryIndex < chapterEntries.length - 1
                              ? "border-b"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                <span>
                                  {dayjs(entry.tanggal).format(
                                    "dddd, D MMM YYYY"
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(entry.status)}
                            </div>
                          </div>

                          <p className="text-gray-800 mb-4 leading-relaxed">
                            {entry.uraian}
                          </p>

                          <div className="flex justify-between">
                            {entry.dokumen && (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={entry.dokumen}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Lihat Dokumen
                                  </a>
                                </Button>
                              </div>
                            )}

                            <div className="flex gap-1">
                              {isMahasiswa && entry.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3"
                                  onClick={() => handleEditClick(entry)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              )}

                              {isDosen && entry.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-green-600 hover:bg-green-400/20 hover:text-green-600 hover:border-green-500/30"
                                    onClick={() =>
                                      handleStatusClick(entry, "accepted")
                                    }
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Terima
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-red-600 hover:bg-red-400/20 hover:text-red-600 hover:border-red-500/30"
                                    onClick={() =>
                                      handleStatusClick(entry, "revised")
                                    }
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Revisi
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </div>
            </Collapsible>
          </div>
        );
      })}

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedStatus === "accepted"
                ? "Konfirmasi Penerimaan Bimbingan"
                : "Konfirmasi Permintaan Revisi"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedStatus === "accepted"
                ? "Apakah Anda yakin ingin menerima logbook bimbingan ini? Status akan berubah menjadi 'Diterima'."
                : "Apakah Anda yakin ingin meminta revisi untuk logbook bimbingan ini? Status akan berubah menjadi 'Perlu Revisi'."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className={
                selectedStatus === "revised"
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-green-600 hover:bg-green-500"
              }
            >
              {selectedStatus === "accepted"
                ? "Ya, Terima"
                : "Ya, Minta Revisi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Logbook</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Edit informasi logbook bimbingan Anda.
            </p>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdateLogbook)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="bab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bab <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bab" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {babOptions.map((bab) => (
                          <SelectItem key={bab} value={bab.toString()}>
                            Bab {bab}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Tanggal <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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
                control={editForm.control}
                name="uraian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Uraian Bimbingan <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan uraian detail bimbingan..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="dokumen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Dokumen</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://drive.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
