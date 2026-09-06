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
import { MonitoringSidang2Service } from "@/api/tugas-akhir";
import { handleToastResponse } from "@/lib/toast-response";

const baseFields = {
  jalur: z.enum(["reguler", "publikasi"], {
    required_error: "Jalur harus dipilih",
  }),
  judul: z.string().min(1, "Judul harus diisi"),
  bidang_kajian: z.string().min(1, "Bidang kajian harus dipilih"),
  link_persetujuan: z
    .string()
    .url("Link persetujuan harus berupa URL yang valid"),
  link_bba: z.string().url("Link BBA harus berupa URL yang valid"),
  link_skbp: z.string().url("Link SKBP harus berupa URL yang valid"),
};

const regulerSchema = z.object({
  ...baseFields,
  jalur: z.literal("reguler"),
  link_dokumen: z.string().url("Link dokumen harus berupa URL yang valid"),
  link_turnitin: z.string().url("Link Turnitin harus berupa URL yang valid"),
});

const publikasiSchema = z.object({
  ...baseFields,
  jalur: z.literal("publikasi"),
  link_saj: z.string().url("Link SAJ harus berupa URL yang valid"),
  url_jurnal: z.string().url("URL jurnal harus berupa URL yang valid"),
  link_file_jurnal: z
    .string()
    .url("Link file jurnal harus berupa URL yang valid"),
  link_loa: z.string().url("Link LOA harus berupa URL yang valid"),
  link_bpk: z.string().url("Link BPK harus berupa URL yang valid"),
});

// Union schema for form validation
const sidangFormSchema = z.discriminatedUnion("jalur", [
  regulerSchema,
  publikasiSchema,
]);

// Type definitions
type RegularFormData = z.infer<typeof regulerSchema>;
type PublikasiFormData = z.infer<typeof publikasiSchema>;
type SidangFormData = z.infer<typeof sidangFormSchema>;

interface DraftData {
  id?: number;
  jalur: string;
  judul: string;
  bidang_kajian: string;
  link_persetujuan: string;
  link_bba: string;
  link_skbp: string;
  link_saj?: string;
  link_dokumen?: string;
  url_jurnal?: string;
  link_file_jurnal?: string;
  link_loa?: string;
  link_bpk?: string;
  link_turnitin?: string;
  status?: string;
}

interface SidangTa2FormProps {
  onSuccess: () => void;
  existingData?: DraftData;
}

const SidangTa2Form = ({ onSuccess, existingData }: SidangTa2FormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!existingData;

  const form = useForm<SidangFormData>({
    resolver: zodResolver(sidangFormSchema),
    mode: "onChange",
    defaultValues: existingData
      ? {
          jalur: existingData.jalur as "reguler" | "publikasi",
          judul: existingData.judul,
          bidang_kajian: existingData.bidang_kajian,
          link_persetujuan: existingData.link_persetujuan,
          link_bba: existingData.link_bba,
          link_skbp: existingData.link_skbp,
          ...(existingData.jalur === "reguler"
            ? {
                link_dokumen: existingData.link_dokumen || "",
                link_turnitin: existingData.link_turnitin || "",
              }
            : {
                link_saj: existingData.link_saj || "",
                url_jurnal: existingData.url_jurnal || "",
                link_file_jurnal: existingData.link_file_jurnal || "",
                link_loa: existingData.link_loa || "",
                link_bpk: existingData.link_bpk || "",
              }),
        }
      : {
          jalur: "reguler" as const,
          judul: "",
          bidang_kajian: "",
          link_persetujuan: "",
          link_bba: "",
          link_skbp: "",
        },
  });

  const jalur = form.watch("jalur");

  // Reset publikasi-specific fields when switching to reguler
  useEffect(() => {
    if (!isEditing && jalur === "reguler") {
      form.unregister("link_saj");
      form.unregister("url_jurnal");
      form.unregister("link_file_jurnal");
      form.unregister("link_loa");
      form.unregister("link_bpk");
    }
  }, [jalur, form, isEditing]);

  const onSubmit = async (data: SidangFormData) => {
    console.log("TA2 Form submitted with data:", data);

    try {
      setIsSubmitting(true);

      // Construct payload with proper type checking
      const submitData =
        data.jalur === "reguler"
          ? ({
              jalur: data.jalur,
              judul: data.judul,
              bidang_kajian: data.bidang_kajian,
              link_persetujuan: data.link_persetujuan,
              link_bba: data.link_bba,
              link_skbp: data.link_skbp,
              link_dokumen: data.link_dokumen,
              link_turnitin: data.link_turnitin,
            } as RegularFormData)
          : ({
              jalur: data.jalur,
              judul: data.judul,
              bidang_kajian: data.bidang_kajian,
              link_persetujuan: data.link_persetujuan,
              link_bba: data.link_bba,
              link_skbp: data.link_skbp,
              link_saj: data.link_saj,
              url_jurnal: data.url_jurnal,
              link_file_jurnal: data.link_file_jurnal,
              link_loa: data.link_loa,
              link_bpk: data.link_bpk,
            } as PublikasiFormData);

      console.log("Submit data:", submitData);

      const response = isEditing
        ? await MonitoringSidang2Service.updateDraftSidang(
            existingData.id!,
            submitData
          )
        : await MonitoringSidang2Service.createDraftSidang(submitData);

      console.log("API Response:", response);

      handleToastResponse(response, () => {
        if (response.success) {
          onSuccess();
        }
      });
    } catch (error: any) {
      console.error("Error submitting TA2 form:", error);

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
          "Gagal menyimpan pengajuan sidang TA2",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Pilih jalur sidang yang sama dengan yang dipilih saat sidang
                TA1. Jalur publikasi memerlukan dokumen tambahan terkait jurnal
                dan publikasi.
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
                  Tuliskan judul final tugas akhir yang telah diselesaikan.
                  Judul ini harus sesuai dengan yang tercantum di dokumen akhir.
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

          {/* Common Fields */}
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
                  Upload surat persetujuan sidang TA2 yang telah ditandatangani
                  oleh dosen pembimbing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link_bba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Link Bukti Bebas Administrasi{" "}
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
                  Masukkan link dokumen Bukti Bebas Administrasi dari bagian
                  administrasi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link_skbp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Link Surat Keterangan Bebas Pustaka{" "}
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
                  Masukkan link dokumen Surat Keterangan Bebas Pustaka (SKBP)
                  dari perpustakaan yang menunjukkan tidak ada tunggakan buku.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Regular Track Specific Fields */}
          {jalur === "reguler" && (
            <>
              <FormField
                control={form.control}
                name="link_dokumen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link Dokumen TA <span className="text-red-500">*</span>
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
                      Masukkan link dokumen dokumen tugas akhir final yang telah
                      selesai dan siap untuk sidang.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_turnitin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link Turnitin <span className="text-red-500">*</span>
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
                      Masukkan link dokumen hasil pengecekan plagiarisme
                      Turnitin untuk dokumen tugas akhir
                      {/* (similarity index maksimal 25%). */}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Publication Track Specific Fields */}
          {jalur === "publikasi" && (
            <>
              <FormField
                control={form.control}
                name="link_saj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bukti Sertifikat Akreditasi Jurnal{" "}
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
                      Masukkan link dokumen Sertifikat Akreditasi Jurnal
                      menunjukkan jurnal yang akan dipublikasikan telah
                      terakreditasi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url_jurnal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL Jurnal <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://journal.example.com/article/xxx"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Link ke halaman jurnal online tempat artikel dipublikasi
                      atau akan dipublikasi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_file_jurnal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link File Jurnal <span className="text-red-500">*</span>
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
                      Masukkan link dokumen artikel jurnal dalam format PDF yang
                      siap atau telah dipublikasi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_loa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link Letter of Acceptance (LOA){" "}
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
                      Masukkan link dokumen Letter of Acceptance (LOA) dari
                      jurnal yang menunjukkan artikel telah diterima untuk
                      publikasi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_bpk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link Bukti Penulis Korespondensi{" "}
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
                      Masukkan link dokumen Bukti Penulis Korespondensi yang
                      menunjukkan bahwa Anda adalah penulis korespondensi untuk
                      artikel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            Tips Pengisian Form:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Pastikan semua file telah di-upload ke cloud storage (Google
              Drive/Dropbox)
            </li>
            <li>
              • Ubah permission file menjadi &quot;Anyone with the link can
              view&quot;
            </li>
            <li>• Gunakan link direct download untuk memudahkan reviewer</li>
            <li>• Periksa kembali semua dokumen sebelum submit</li>
          </ul>
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

export default SidangTa2Form;
