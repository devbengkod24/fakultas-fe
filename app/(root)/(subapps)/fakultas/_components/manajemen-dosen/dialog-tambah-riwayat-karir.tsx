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

const formSchema = z.object({
  posisi: z.string().min(1, "Posisi wajib diisi"),
  instasi: z.string().min(1, "Institusi wajib diisi"),
  tahun: z.string().min(1, "Tahun wajib diisi"),
});

type FormData = z.infer<typeof formSchema>;

const DialogTambahRiwayatKarir: React.FC = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      posisi: "",
      instasi: "",
      tahun: "",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    console.log("Tambah riwayat karir:", data);
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
          <DialogTitle>Tambah Riwayat Karir</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField control={form.control} name="tahun" render={({ field }) => (
              <FormItem><FormLabel>Tahun</FormLabel><FormControl><Input placeholder="Contoh: 2020 - Sekarang" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="posisi" render={({ field }) => (
              <FormItem><FormLabel>Posisi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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

export default DialogTambahRiwayatKarir;