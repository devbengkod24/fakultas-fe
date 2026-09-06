"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  AlertCircle,
  FileText,
  BookOpen,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogbookService } from "@/api/tugas-akhir";
import { StudentHeader } from "../_components/logbook/student-header";
import { LogbookTimeline } from "../_components/logbook/logbook-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/empty-state";
import { handleToastResponse } from "@/lib/toast-response";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { toast } from "sonner";

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

const studentFetcher = () =>
  LogbookService.getDetailMahasiswa().then((res) => res);
const logbookFetcher = () =>
  LogbookService.getLogbookEntries(1, 100).then((res) => res);
const folderFetcher = () => LogbookService.getFolder().then((res) => res);

export default function MahasiswaLogbook() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mutateStudentFolder, setMutateStudentFolder] = useState<
    (() => void) | null
  >(null);

  const {
    data: studentResponse,
    error: studentError,
    isLoading: studentLoading,
    mutate: mutateStudent,
  } = useSWR("student-detail", studentFetcher);

  const {
    data: logbookResponse,
    error: logbookError,
    isLoading: logbookLoading,
    mutate: mutateLogbook,
  } = useSWR("logbook-entries", logbookFetcher);

  const { data: folderResponse, mutate: mutateFolder } = useSWR(
    "folder-ta",
    folderFetcher
  );

  const student = studentResponse?.success ? studentResponse.data : null;
  const logbookEntries =
    logbookResponse?.data && logbookResponse.meta?.success
      ? logbookResponse.data
      : [];

  const folder = folderResponse?.success ? folderResponse.data : null;
  const hasFolderTA = !!(folder?.link_folder || student?.folder_ta);

  const today = new Date();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uraian: "",
      bab: undefined,
      tanggal: today,
      dokumen: "",
    },
  });

  const handleCreateLogbook = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await LogbookService.createLogbook({
        uraian: data.uraian,
        bab: data.bab,
        tanggal: format(data.tanggal, "yyyy-MM-dd"),
        dokumen: data.dokumen || null,
      });

      handleToastResponse(response, () => {
        form.reset({
          uraian: "",
          bab: undefined,
          tanggal: today,
          dokumen: "",
        });
        setCreateModalOpen(false);
        mutateLogbook();
        mutateStudent();
        if (mutateStudentFolder) {
          mutateStudentFolder();
        }
      });
    } catch (error) {
      console.error("Error creating logbook:", error);
      handleToastResponse({
        success: false,
        message: "Gagal membuat logbook. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLogbookClick = () => {
    if (!hasFolderTA) {
      toast.info("Folder TA diperlukan", {
        description:
          "Silakan isi link folder TA terlebih dahulu sebelum membuat logbook baru.",
      });
      return;
    }
    setCreateModalOpen(true);
  };

  useEffect(() => {
    setMutateStudentFolder(() => () => {
      mutateFolder();
    });
  }, [mutateFolder]);

  if (studentLoading || logbookLoading) {
    return (
      <div>
        <div className="container">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Student Header Skeleton */}
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (studentError) {
    return (
      <div>
        <div className="container">
          <Button
            variant="ghost"
            className="pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary mb-4"
            onClick={() => router.push("/tugas-akhir/logbook")}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Mahasiswa
          </Button>

          <EmptyState
            icon={AlertCircle}
            title="Gagal Memuat Data"
            subtitle="Terjadi kesalahan saat mengambil data mahasiswa. Silakan coba lagi."
            button={
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Coba Lagi
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <EmptyState
        icon={FileText}
        title="Logbook Tidak Tersedia"
        subtitle="Silahkan mengajukan tugas akhir terlebih dahulu untuk membuat dan mengakses logbook"
        button={
          <Button
            onClick={() => router.push("/tugas-akhir/pengajuan-mahasiswa")}
            variant="outline"
          >
            <BookOpen className="h-4 w-4" />
            Ajukan Tugas Akhir
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="container">
        <StudentHeader
          data={student}
          role="mahasiswa"
          onMutateFolder={mutateStudentFolder ?? undefined}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold ">Riwayat Bimbingan</h2>
            <Button
              size={"sm"}
              onClick={handleCreateLogbookClick}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Buat Logbook Baru
            </Button>
          </div>
          {logbookError ? (
            <EmptyState
              icon={AlertCircle}
              title="Gagal Memuat Data Logbook"
              subtitle="Terjadi kesalahan saat mengambil data logbook. Silakan coba lagi."
              button={
                <Button onClick={() => mutateLogbook()} variant="outline">
                  Coba Lagi
                </Button>
              }
            />
          ) : (
            <LogbookTimeline
              entries={logbookEntries}
              role="mahasiswa"
              onUpdate={() => {
                mutateLogbook();
                mutateStudent();
              }}
            />
          )}
        </div>

        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Buat Logbook Baru</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Isi form berikut untuk membuat logbook baru.
              </p>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateLogbook)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
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
                          <SelectItem value="1">Bab 1</SelectItem>
                          <SelectItem value="2">Bab 2</SelectItem>
                          <SelectItem value="3">Bab 3</SelectItem>
                          <SelectItem value="4">Bab 4</SelectItem>
                          <SelectItem value="5">Bab 5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
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
                  control={form.control}
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
                  control={form.control}
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
                    onClick={() => setCreateModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
