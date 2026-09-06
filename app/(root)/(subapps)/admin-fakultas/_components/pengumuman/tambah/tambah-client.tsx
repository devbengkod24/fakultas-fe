"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Send, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard-header";
import RichTextEditor from "@/components/rich-text-editor";
import withAuth from "@/app/(root)/hoc/withAuth";
import { toast } from "sonner";

// Schema validasi khusus pengumuman fakultas
const formSchema = z.object({
  judul: z
    .string()
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  isi: z.string().min(20, "Isi pengumuman minimal 20 karakter"),
  status: z.enum(["draft", "published"]).default("published"),
});

type FormData = z.infer<typeof formSchema>;

function BuatPengumumanClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: "",
      isi: "",
      status: "published",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Simpan Pengumuman:", data);
      toast.success("Pengumuman berhasil dipublikasikan");
      router.push("/admin-fakultas/pengumuman/tambah");
    } catch (error) {
      toast.error("Gagal membuat pengumuman");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumb = [
    { name: "Dashboard", url: "/admin-fakultas" },
    { name: "Pengumuman", url: "/admin-fakultas/pengumuman/tambah" },
    { name: "Buat Pengumuman", url: "" },
  ];

  const titleItems = [
    {
      title: "Buat Pengumuman Baru",
      subtitle: "Publikasikan informasi resmi untuk seluruh civitas akademika fakultas.",
    },
  ];

  return (
    <div className="max-w-none mx-auto pb-20 space-y-4">
      <DashboardHeader breadcrumbItems={breadcrumb} titleItems={titleItems} />

      <div className="px-2 mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-none border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Detail Pengumuman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">
                        Judul Pengumuman <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul pengumuman yang informatif"
                          {...field}
                          className="h-11 bg-background"
                        />
                      </FormControl>
                      <FormDescription>
                        Gunakan judul yang singkat dan jelas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">
                        Isi Pengumuman <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Tuliskan detail pengumuman di sini..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/admin-fakultas/pengumuman/tambah")}
                className="h-11 px-6 text-muted-foreground hover:text-foreground border border-border"
              >
                <ArrowLeft className="size-4 mr-2" />
                Batal
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.setValue("status", "draft");
                    form.handleSubmit(onSubmit)();
                  }}
                  className="h-11 px-6 hidden sm:flex"
                >
                  <Save className="size-4 mr-2" />
                  Simpan Draft
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-8 bg-primary hover:bg-primary/90 text-white shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2 text-white" />
                      Publikasikan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default withAuth(BuatPengumumanClient, "admin-fakultas", ["admin_fakultas", "super_fakultas"]);
