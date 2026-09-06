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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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

const formSchema = z.object({
  tahun: z.string().min(1, "Tahun wajib diisi"),
  jenjang: z.string().min(1, "Jenjang wajib diisi"),
  programStudi: z.string().min(1, "Program studi wajib diisi"),
  instasi: z.string().min(1, "Institusi wajib diisi"),
});

type FormData = z.infer<typeof formSchema>;

const DialogTambahRiwayatPendidikan: React.FC = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tahun: "",
      jenjang: "",
      programStudi: "",
      instasi: "",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    console.log("Tambah riwayat pendidikan:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Riwayat Pendidikan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField control={form.control} name="tahun" render={({ field }) => (
              <FormItem><FormLabel>Tahun</FormLabel><FormControl><Input placeholder="Contoh: 2015" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="jenjang" render={({ field }) => (
              <FormItem><FormLabel>Jenjang</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Doktor (S3)">Doktor (S3)</SelectItem>
                    <SelectItem value="Magister (S2)">Magister (S2)</SelectItem>
                    <SelectItem value="Sarjana (S1)">Sarjana (S1)</SelectItem>
                    <SelectItem value="Diploma (D3)">Diploma (D3)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="programStudi" render={({ field }) => (
              <FormItem><FormLabel>Program Studi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="instasi" render={({ field }) => (
              <FormItem><FormLabel>Institusi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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

export default DialogTambahRiwayatPendidikan;