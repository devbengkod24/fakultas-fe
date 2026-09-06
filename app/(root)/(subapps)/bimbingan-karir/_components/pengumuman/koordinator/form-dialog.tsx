"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/rich-text-editor";
import React from "react";
import { Announcement } from "@/types/bimbingan-karir/koordinator/pengumuman/pengumuman";

interface FormDialogAnnouncementProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: "add" | "edit";
  announcement?: Announcement;
  onSubmit: (announcement: { id:number, judul: string; published_at: string; isi: string }) => void;
}

const FormDialogAnnouncement = ({ isOpen, setIsOpen, mode, announcement, onSubmit }: FormDialogAnnouncementProps) => {
  const isEditing = mode === "edit";
  const [form, setForm] = React.useState({
    id: announcement?.id,
    judul: announcement?.judul || "",
    published_at: announcement?.published_at || new Date().toISOString().split("T")[0],
    isi: announcement?.isi || "",
  });

  React.useEffect(() => {
    if (announcement) {
      setForm({
        id: announcement.id,
        judul: announcement.judul || "",
        published_at: announcement.published_at,
        isi: announcement.isi || "",
      });
    }
  }, [announcement]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleContentChange = (content: string) => {
    setForm((prev) => ({ ...prev, isi: content }));
  };  

  const handleSubmit = () => {
    if (mode === "add") {
      if (!form.judul || !form.published_at || !form.isi) {
        alert("Semua field harus diisi");
        return;
      }
    } else if (mode === "edit") {
      if (!form.judul && !form.isi) {
        alert("Minimal isi judul atau isi untuk mengedit");
        return;
      }
    }
    onSubmit({
      id: form.id ?? 0,
      judul: form.judul,
      published_at: form.published_at,
      isi: form.isi,
    });
    setForm({
      id: form.id,
      judul: "",
      published_at: new Date().toISOString().split("T")[0],
      isi: "",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</DialogTitle>
          <DialogDescription>Isi detail pengumuman yang {isEditing ? "diedit" : "akan ditambahkan"}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="judul">Judul</Label>
            <Input id="judul" value={form.judul} onChange={handleChange} placeholder="Masukkan judul pengumuman" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="isi">Konten</Label>
            <div className="border rounded-md">
              <RichTextEditor content={form.isi} onChange={handleContentChange} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialogAnnouncement;
