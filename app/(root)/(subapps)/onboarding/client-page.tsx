"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  GraduationCap,
  Phone,
  FileText,
  Mail,
  Hash,
  Link,
} from "lucide-react";
import withAuth from "../../hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";

const updateMahasiswaSchema = z.object({
  ipk: z
    .string()
    .min(1, "IPK harus diisi")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 4;
    }, "IPK harus antara 0.00 - 4.00"),
  telepon: z
    .string()
    .min(1, "Nomor telepon harus diisi")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),
  transkrip: z
    .string()
    .min(1, "Link transkrip harus diisi")
    .url("Format URL tidak valid"),
});

type FormData = z.infer<typeof updateMahasiswaSchema>;

function OnboardingPage() {
  const { profile } = useProfile();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstPermission = profile?.permissions?.[0];

  useEffect(() => {
    if (profile) {
      // Check if user doesn't have mahasiswa data
      if (!profile.mahasiswa) {
        router.replace(firstPermission || "/apps");
        return;
      }

      // Check if mahasiswa profile is already completed
      if (profile.mahasiswa.is_completed === true) {
        const selectedPermission = localStorage.getItem("selected_permission");

        router.replace(selectedPermission || firstPermission || "/apps");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(updateMahasiswaSchema),
    defaultValues: {
      ipk: "",
      telepon: "",
      transkrip: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await AuthService.updateMahasiswa(data);

      handleToastResponse(response, () => {
        // This callback runs only on success
        const selectedPermission = localStorage.getItem("selected_permission");
        const firstPermission = profile?.permissions?.[0];
        window.location.href = selectedPermission || firstPermission || "/apps";
      });
    } catch {
      handleToastResponse({
        success: false,
        message: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sidebar p-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Lengkapi Profil Anda
          </h1>
          <p className="text-gray-600">
            Silakan lengkapi informasi yang masih kosong untuk melanjutkan
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informasi Akun Mahasiswa */}
          <Card className="h-fit shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Akun Mahasiswa
              </CardTitle>
              <CardDescription>
                Data yang sudah terdaftar dalam sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg border uppercase">
                    {profile?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {profile?.name}
                  </h3>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
              </div>

              {/* Detail Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Nomor Induk Mahasiswa
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile?.mahasiswa?.nim}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Email Akademik
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm font-medium text-yellow-800">
                    Status: Profil Belum Lengkap
                  </p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Lengkapi data yang diperlukan untuk mengaktifkan semua fitur
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form untuk melengkapi data */}
          <Card className="h-fit shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Lengkapi Data Mahasiswa
              </CardTitle>
              <CardDescription>
                Isi informasi yang masih kosong untuk melengkapi profil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="ipk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          IPK <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            placeholder="Contoh: 3.75"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Masukkan IPK dengan skala 0.00 - 4.00
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nomor Telepon <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="tel"
                              placeholder="Contoh: 08123456789"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Masukkan nomor telepon yang aktif
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transkrip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Link Transkrip Nilai{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="url"
                              placeholder="https://drive.google.com/file/d/..."
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Masukkan link Google Drive, Dropbox, atau platform
                          cloud storage lainnya
                        </p>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(OnboardingPage);
