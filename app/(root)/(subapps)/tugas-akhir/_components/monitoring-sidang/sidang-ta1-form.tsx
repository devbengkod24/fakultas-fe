/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { MonitoringSidang1Service } from "@/api/tugas-akhir";
import { handleToastResponse } from "@/lib/toast-response";

// Define base fields for both schemas
const baseFields = {
  jalur: z.enum(["reguler", "publikasi"], {
    required_error: "Jalur harus dipilih",
  }),
  judul: z.string().min(1, "Judul harus diisi"),
  bidang_kajian: z.string().min(1, "Bidang kajian harus dipilih"),
  link_dokumen: z.string().url("Link dokumen harus berupa URL yang valid"),
  link_persetujuan: z
    .string()
    .url("Link persetujuan harus berupa URL yang valid"),
};

// Define schemas for reguler and publikasi
const regulerSchema = z.object({
  ...baseFields,
  jalur: z.literal("reguler"),
});

const publikasiSchema = z.object({
  ...baseFields,
  jalur: z.literal("publikasi"),
  link_persetujuan_jurnal: z
    .string()
    .url("Link persetujuan jurnal harus berupa URL yang valid"),
  status_jurnal: z.enum(["draft", "submit", "publish"], {
    required_error: "Status jurnal harus dipilih",
  }),
});

// Union schema for form validation
const sidangFormSchema = z.discriminatedUnion("jalur", [
  regulerSchema,
  publikasiSchema,
]);

// Type definitions
type RegulerFormData = z.infer<typeof regulerSchema>;
type PublikasiFormData = z.infer<typeof publikasiSchema>;
type SidangFormData = z.infer<typeof sidangFormSchema>;

interface DraftData {
  id?: number;
  jalur: "reguler" | "publikasi";
  judul: string;
  bidang_kajian: string;
  link_dokumen: string;
  link_persetujuan: string;
  link_persetujuan_jurnal?: string;
  status_jurnal?: "draft" | "submit" | "publish";
  status?: string;
}

interface SidangTa1FormProps {
  onSuccess: () => void;
  existingData?: DraftData;
}

const SidangTa1Form = ({ onSuccess, existingData }: SidangTa1FormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!existingData;

  const form = useForm<SidangFormData>({
    resolver: zodResolver(sidangFormSchema),
    mode: "onChange",
    defaultValues: existingData
      ? {
          jalur: existingData.jalur,
          judul: existingData.judul,
          bidang_kajian: existingData.bidang_kajian,
          link_dokumen: existingData.link_dokumen,
          link_persetujuan: existingData.link_persetujuan,
          ...(existingData.jalur === "publikasi" && {
            link_persetujuan_jurnal: existingData.link_persetujuan_jurnal || "",
            status_jurnal: existingData.status_jurnal || "draft",
          }),
        }
      : {
          jalur: "reguler" as const,
          judul: "",
          bidang_kajian: "",
          link_dokumen: "",
          link_persetujuan: "",
        },
  });

  const jalur = form.watch("jalur");

  // Reset publikasi-specific fields when switching to reguler
  useEffect(() => {
    if (!isEditing && jalur === "reguler") {
      // Use unregister to properly remove fields
      form.unregister("link_persetujuan_jurnal");
      form.unregister("status_jurnal");
    }
  }, [jalur, form, isEditing]);

  const onSubmit = async (data: SidangFormData) => {
    console.log("Form submitted with data:", data);

    try {
      setIsSubmitting(true);

      // Construct payload with proper type checking
      const submitData =
        data.jalur === "reguler"
          ? ({
              jalur: data.jalur,
              judul: data.judul,
              bidang_kajian: data.bidang_kajian,
              link_dokumen: data.link_dokumen,
              link_persetujuan: data.link_persetujuan,
            } as RegulerFormData)
          : ({
              jalur: data.jalur,
              judul: data.judul,
              bidang_kajian: data.bidang_kajian,
              link_dokumen: data.link_dokumen,
              link_persetujuan: data.link_persetujuan,
              link_persetujuan_jurnal: data.link_persetujuan_jurnal,
              status_jurnal: data.status_jurnal,
            } as PublikasiFormData);

      console.log("Submit data:", submitData);

      const response = isEditing
        ? await MonitoringSidang1Service.updateDraftSidang(
            existingData!.id!,
            submitData
          )
        : await MonitoringSidang1Service.createDraftSidang(submitData);

      console.log("API Response:", response);

      handleToastResponse(response, () => {
        if (response.success) {
          onSuccess();
        }
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Handle validation errors from API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          form.setError(field as keyof SidangFormData, {
            type: "manual",
            message: errors[field][0],
          });
        });
      }

      handleToastResponse({
        success: false,
        message:
          error.response?.data?.message ||
          "Gagal menyimpan pengajuan sidang TA1",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug form state
  console.log("Form state:", {
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    values: form.getValues(),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Jalur Selection */}
        <FormField
          control={form.control}
          name="jalur"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Jalur Sidang <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-6"
                  disabled={isEditing}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reguler" id="reguler" />
                    <FormLabel htmlFor="reguler">Reguler</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="publikasi" id="publikasi" />
                    <FormLabel htmlFor="publikasi">Publikasi</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Pilih jalur sidang sesuai dengan tugas akhir. Jalur publikasi
                memerlukan dokumen tambahan terkait jurnal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {/* Judul */}
          <FormField
            control={form.control}
            name="judul"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  Judul Tugas Akhir <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Masukkan judul tugas akhir"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tuliskan judul tugas akhir yang telah disetujui oleh dosen
                  pembimbing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bidang Kajian */}
          <FormField
            control={form.control}
            name="bidang_kajian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Bidang Kajian <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bidang kajian" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SC">SC (Sistem Cerdas)</SelectItem>
                    <SelectItem value="RPLD">
                      RPLD (Rekayasa Perangkat Lunak dan Data)
                    </SelectItem>
                    <SelectItem value="SK3D">
                      SK3D (Sistem Komputer, Keamanan, dan Komputasi
                      Terdistribusi)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Pilih bidang kajian yang sesuai dengan topik tugas akhir Anda.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Link Dokumen */}
          <FormField
            control={form.control}
            name="link_dokumen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Link Dokumen <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/file/d/xxx"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Upload file dokumen tugas akhir ke Google Drive atau Dropbox
                  (.pdf)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Link Persetujuan */}
          <FormField
            control={form.control}
            name="link_persetujuan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Link Persetujuan Pembimbing{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/file/d/xxx"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Upload surat persetujuan yang telah ditandatangani oleh dosen
                  pembimbing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publication Track Additional Fields */}
          {jalur === "publikasi" && (
            <>
              <FormField
                control={form.control}
                name="link_persetujuan_jurnal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link Persetujuan Jurnal{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://drive.google.com/file/d/xxx"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload surat persetujuan submit jurnal yang telah
                      ditandatangani oleh dosen pembimbing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status_jurnal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status Jurnal <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status jurnal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">
                          Draft - Masih dalam tahap penulisan
                        </SelectItem>
                        <SelectItem value="submit">
                          Submit - Telah disubmit ke jurnal
                        </SelectItem>
                        <SelectItem value="publish">
                          Publish - Telah diterbitkan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pilih status terkini dari jurnal yang akan atau telah
                      disubmit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? `${isEditing ? "Mengupdate" : "Menyimpan"}...`
              : `${isEditing ? "Update" : "Simpan"} Pengajuan`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SidangTa1Form;
