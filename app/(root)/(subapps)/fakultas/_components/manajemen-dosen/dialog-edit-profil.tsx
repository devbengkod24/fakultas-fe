"use client";

import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dosen } from "@/types/fakultas/penelitian/penelitian";

const formSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  gelar_depan: z.string().optional(),
  gelar_belakang: z.string().optional(),
  prodi_homebase: z.string().min(1, "Pilih prodi homebase"),
  prodi_tugas: z.string().min(1, "Pilih prodi tugas"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
});

type FormData = z.infer<typeof formSchema>;

interface DialogEditProfilProps {
  dosen: Dosen;
}

const DialogEditProfil: React.FC<DialogEditProfilProps> = ({ dosen }) => {
  const [open, setOpen] = useState(false);

  const getProdiValue = (prodi: any): string => {
    if (!prodi) return "";
    if (typeof prodi === "object" && prodi !== null) return prodi.kode_prodi || "";
    return String(prodi);
  };

  const getProdiTugasValue = (prodiTugas: any): string => {
    if (!prodiTugas) return "";
    if (Array.isArray(prodiTugas)) {
      return prodiTugas.map(p => typeof p === "object" ? p.kode_prodi : p).join(", ");
    }
    return String(prodiTugas);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: dosen.nama || "",
      gelar_depan: dosen.gelar_depan || "",
      gelar_belakang: dosen.gelar_belakang || "",
      prodi_homebase: getProdiValue(dosen.prodi_homebase),
      prodi_tugas: getProdiTugasValue(dosen.prodi_tugas),
      jabatan: dosen.jabatan || "",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    console.log("Edit profil:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Pencil className="h-4 w-4" />
          Edit Profil
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profil Dosen</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="gelar_depan" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gelar Depan</FormLabel>
                  <FormControl><Input {...field} placeholder="cth: Dr." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gelar_belakang" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gelar Belakang</FormLabel>
                  <FormControl><Input {...field} placeholder="cth: M.Kom." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="nama" render={({ field }) => (
              <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="jabatan" render={({ field }) => (
              <FormItem><FormLabel>Jabatan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Guru Besar">Guru Besar</SelectItem>
                    <SelectItem value="Lektor Kepala">Lektor Kepala</SelectItem>
                    <SelectItem value="Lektor">Lektor</SelectItem>
                    <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
                    <SelectItem value="Tenaga Pengajar">Tenaga Pengajar</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="prodi_homebase" render={({ field }) => (
              <FormItem><FormLabel>Prodi Homebase</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="A11">Teknik Informatika</SelectItem>
                    <SelectItem value="A12">Sistem Informasi</SelectItem>
                    <SelectItem value="D4">Bisnis Digital</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="prodi_tugas" render={({ field }) => (
              <FormItem><FormLabel>Prodi Tugas</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="A11">Teknik Informatika</SelectItem>
                    <SelectItem value="A12">Sistem Informasi</SelectItem>
                    <SelectItem value="D4">Bisnis Digital</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditProfil;