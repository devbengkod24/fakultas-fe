/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
  Check,
  FileCheck,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import DosenSelector from "./dosen-selector";
import FormPreview from "./form-preview";
import { PengajuanMahasiswaService } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const formSchema = z.object({
  track: z.enum(["Reguler", "Publikasi", "Projek"], {
    required_error: "Pilih jalur tugas akhir",
  }),
  title: z
    .string()
    .min(10, "Judul minimal 10 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  topic: z
    .string()
    .min(10, "Topik minimal 10 karakter")
    .max(500, "Topik maksimal 500 karakter"),
  description: z
    .string()
    .min(50, "Deskripsi minimal 50 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  field_of_study: z.enum(["RPLD", "SK3D", "SC"], {
    required_error: "Pilih bidang kajian",
  }),
  interest: z.array(z.string()).min(1, "Pilih minimal 1 minat"),
  dosen_id: z.number({
    required_error: "Pilih dosen pembimbing",
  }),
});

type FormData = z.infer<typeof formSchema>;

const interestOptions = [
  "Backend Development",
  "Frontend Development",
  "Mobile Development",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Game Development",
  "UI/UX Design",
  "DevOps",
  "Cloud Computing",
];

const RequiredFormLabel = ({
  children,
  required = true,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <FormLabel>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </FormLabel>
);

interface PengajuanFormProps {
  submissionStatus?: string | null;
  onTabChange?: (tab: string) => void;
  mutate?: () => void;
  isPlotting?: boolean;
  plottingData?: any;
}

export default function PengajuanForm({
  submissionStatus,
  onTabChange,
  mutate,
  isPlotting = false,
  plottingData,
}: PengajuanFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newInterest, setNewInterest] = useState("");
  const [selectedDosen, setSelectedDosen] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form should be disabled
  const isFormDisabled =
    !isPlotting &&
    (submissionStatus === "pending" || submissionStatus === "accepted");

  // Get step from URL params, default to 1
  const currentStep = parseInt(searchParams.get("step") || "1");
  const step = currentStep >= 1 && currentStep <= 3 ? currentStep : 1;

  const STORAGE_KEY = isPlotting
    ? "pengajuan-ta-plot-form"
    : "pengajuan-ta-form";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: undefined,
      title: "",
      topic: "",
      description: "",
      field_of_study: undefined,
      interest: [],
      dosen_id: undefined,
    },
  });

  const { watch, setValue, getValues } = form;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const watchedInterest = watch("interest") || [];

  // Load state from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.formData) {
          form.reset(parsed.formData);
        }
        if (parsed.selectedDosen) {
          setSelectedDosen(parsed.selectedDosen);
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [form]);

  // Save state to localStorage whenever form data changes
  useEffect(() => {
    if (!isFormDisabled) {
      const formData = getValues();
      const stateToSave = {
        formData,
        selectedDosen,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [getValues, selectedDosen, watchedInterest, isFormDisabled]);

  // Set dosen for plotting mode
  useEffect(() => {
    if (isPlotting && plottingData) {
      setSelectedDosen({
        id: plottingData.tugas_akhir_id, // Use appropriate ID
        name: plottingData.nama_dosen,
        email: plottingData.email,
        npp: plottingData.npp,
      });
      setValue("dosen_id", plottingData.tugas_akhir_id);
    }
  }, [isPlotting, plottingData, setValue]);

  const [hasResetInitialStep, setHasResetInitialStep] = useState(false);
  const prevStatusRef = useRef<string | null | undefined>(submissionStatus);

  useEffect(() => {
    // Detect: status is explicitly 'canceled', OR transition from pending → null
    const isCancelled =
      submissionStatus === "canceled" ||
      (prevStatusRef.current === "pending" && submissionStatus === null);
    const isRejected = submissionStatus === "rejected";

    if ((isCancelled || isRejected) && !hasResetInitialStep) {
      if (currentStep !== 1) {
        updateStep(1);
      }
      // Clear stale form data so step 1 starts fresh
      localStorage.removeItem(STORAGE_KEY);
      form.reset();
      setSelectedDosen(null);
      setHasResetInitialStep(true);
    }

    // Update ref for next cycle
    if (submissionStatus !== prevStatusRef.current) {
      prevStatusRef.current = submissionStatus;
    }
  }, [submissionStatus, currentStep, hasResetInitialStep, STORAGE_KEY]);

  const updateStep = (newStep: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", newStep.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const addInterest = (interest: string) => {
    if (!watchedInterest.includes(interest)) {
      setValue("interest", [...watchedInterest, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setValue(
      "interest",
      watchedInterest.filter((i) => i !== interest)
    );
  };

  const addCustomInterest = () => {
    if (newInterest.trim() && !watchedInterest.includes(newInterest.trim())) {
      setValue("interest", [...watchedInterest, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        track: data.track,
        title: data.title,
        topic: data.topic,
        description: data.description,
        field_of_study: data.field_of_study,
        interest: data.interest,
        dosen_id: data.dosen_id,
      };

      let response;
      if (isPlotting) {
        response = await PengajuanMahasiswaService.inputPengajuanByPlot(
          payload
        );
      } else {
        response = await PengajuanMahasiswaService.pengajuanTA(payload);
      }

      handleToastResponse(response);

      if (response.success) {
        // Clear form state
        localStorage.removeItem(STORAGE_KEY);
        form.reset();
        setSelectedDosen(null);

        // Refresh status data
        if (mutate) {
          mutate();
        }

        // Clean up URL parameters and switch to status tab
        const params = new URLSearchParams(searchParams);
        params.delete("step");
        params.set("tab", "status");

        const newUrl = `?${params.toString()}`;
        router.replace(newUrl, { scroll: false });

        // Trigger tab change to status
        if (onTabChange) {
          onTabChange("status");
        }
      }
    } catch (error: any) {
      if (error.response?.data) {
        handleToastResponse(error.response.data);
      } else {
        toast.error(
          `Gagal ${isPlotting ? "melengkapi data" : "mengirim pengajuan"}`,
          {
            description: "Silakan coba lagi.",
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (selectedDosen) {
        updateStep(2);
      }
    } else if (step === 2) {
      const fieldsToValidate = [
        "track",
        "title",
        "topic",
        "description",
        "field_of_study",
        "interest",
      ];
      const isValid = await form.trigger(fieldsToValidate as any);

      if (isValid && watchedInterest.length > 0) {
        updateStep(3);
      } else if (watchedInterest.length === 0) {
        form.setError("interest", {
          type: "manual",
          message: "Pilih minimal 1 minat",
        });
      }
    }
  };

  const prevStep = () => {
    updateStep(step - 1);
  };

  // Show empty state if form is disabled - moved after all hooks
  if (isFormDisabled) {
    const getEmptyStateContent = () => {
      if (submissionStatus === "pending") {
        return {
          icon: AlertCircle,
          title: "Silahkan Cek Pengajuan Anda",
          subtitle:
            "Anda sudah memiliki pengajuan yang sedang diproses. Silahkan cek status pengajuan Anda di tab 'Pengajuan Anda'.",
        };
      }
      if (submissionStatus === "accepted") {
        return {
          icon: FileCheck,
          title: "Pengajuan Anda Sudah Diterima",
          subtitle:
            "Pengajuan tugas akhir Anda sudah diterima, silahkan cek 'Pengajuan Anda' untuk lebih detailnya.",
        };
      }
      return {
        icon: AlertCircle,
        title: "Form Tidak Tersedia",
        subtitle: "Form pengajuan tidak dapat digunakan saat ini.",
      };
    };

    const emptyStateContent = getEmptyStateContent();

    return (
      <div className="relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg" />
        <div className="relative z-20 flex items-center justify-center min-h-[400px]">
          <EmptyState
            icon={emptyStateContent.icon}
            title={emptyStateContent.title}
            subtitle={emptyStateContent.subtitle}
            button={
              onTabChange && (
                <Button variant="outline" onClick={() => onTabChange("status")}>
                  Cek Pengajuan Anda
                </Button>
              )
            }
          />
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {isPlotting
                ? "Langkah 1: Dosen Pembimbing Anda"
                : "Langkah 1: Pilih Dosen Pembimbing"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isPlotting
                ? "Dosen pembimbing telah ditetapkan oleh koordinator"
                : "Klik untuk memilih dosen pembimbing tugas akhir Anda"}
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={nextStep}
              disabled={!selectedDosen}
              className="flex items-center"
            >
              Selanjutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {isPlotting ? (
          <Card className="shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="border">
                    {getInitials(selectedDosen?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedDosen?.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {selectedDosen?.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DosenSelector
            onSelect={(dosen) => {
              setSelectedDosen(dosen);
              setValue("dosen_id", dosen.id);
            }}
            selected={selectedDosen}
          />
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {isPlotting
                ? "Langkah 2: Lengkapi Data Tugas Akhir"
                : "Langkah 2: Isi Form Pengajuan"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Lengkapi detail tugas akhir Anda
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center"
            >
              <ChevronLeft className="size-4" />
              Kembali
            </Button>
            <Button
              onClick={nextStep}
              className="flex items-center"
              disabled={watchedInterest.length === 0}
            >
              Selanjutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <div className="flex gap-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="track"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFormLabel>Jalur Tugas Akhir</RequiredFormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isFormDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jalur tugas akhir" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Reguler">Reguler</SelectItem>
                          <SelectItem value="Publikasi">Publikasi</SelectItem>
                          <SelectItem value="Projek">Projek</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="field_of_study"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFormLabel>Bidang Kajian</RequiredFormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isFormDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih bidang kajian" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RPLD">
                            RPLD (Rekayasa Perangkat Lunak dan Data)
                          </SelectItem>
                          <SelectItem value="SK3D">
                            SK3D (Sistem Komputer, Keamanan, dan Komputasi
                            Distribusi)
                          </SelectItem>
                          <SelectItem value="SC">
                            SC (Sistem Cerdas)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Topik</RequiredFormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan topik penelitian"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Topik harus relevan dengan bidang kajian dan minat Anda
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Judul Tugas Akhir</RequiredFormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul tugas akhir"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Judul harus jelas dan menggambarkan topik penelitian
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Deskripsi</RequiredFormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan deskripsi detail tugas akhir Anda"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Berikan deskripsi yang detail tentang tugas akhir yang akan
                    dikerjakan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest"
              render={({}) => (
                <FormItem>
                  <RequiredFormLabel>Minat/Keahlian</RequiredFormLabel>
                  <FormDescription>
                    Pilih atau tambahkan minat yang sesuai dengan tugas akhir
                    Anda
                  </FormDescription>

                  <div className="space-y-4">
                    {/* Selected interests */}
                    {watchedInterest.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {watchedInterest.map((interest) => (
                          <Badge
                            key={interest}
                            className="flex items-center gap-1"
                          >
                            {interest}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeInterest(interest)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Available interests */}
                    <div className="flex flex-wrap gap-2">
                      {interestOptions
                        .filter((option) => !watchedInterest.includes(option))
                        .map((interest) => (
                          <Badge
                            key={interest}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted hover:text-primary-foreground px-1"
                            onClick={() => addInterest(interest)}
                          >
                            <Plus className="size-3 mr-1" />
                            {interest}
                          </Badge>
                        ))}
                    </div>

                    {/* Custom interest input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tambah minat custom"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomInterest();
                          }
                        }}
                        disabled={isFormDisabled}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomInterest}
                        disabled={!newInterest.trim()}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {isPlotting
                ? "Langkah 3: Review & Simpan Data"
                : "Langkah 3: Review & Submit"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Periksa kembali data {isPlotting ? "kelengkapan" : "pengajuan"}{" "}
              Anda
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center"
              disabled={isSubmitting}
            >
              <ChevronLeft className="size-4" />
              Kembali
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin size-4" />
                  {isPlotting ? "Menyimpan Data..." : "Mengirim Pengajuan..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="size-4" />
                  {isPlotting ? "Simpan Data" : "Submit Pengajuan"}
                </div>
              )}
            </Button>
          </div>
        </div>

        <FormPreview data={getValues()} selectedDosen={selectedDosen} />
      </div>
    );
  }

  return null;
}
