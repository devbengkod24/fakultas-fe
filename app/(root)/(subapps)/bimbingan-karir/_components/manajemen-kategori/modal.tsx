"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KategoriService } from "@/api/bimbingan-karir";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ModalManajemenKategori({
    isOpen,
    onClose,
    mutate,
}: {
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: "",
        kode: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                nama: formData.nama,
                kode: formData.kode || formData.nama.toLowerCase().replace(/\s+/g, '_')
            }
            const response = await KategoriService.store(payload);
            if (response.success) {
                toast.success(response.message);
                setFormData({ nama: "", kode: "" });
                mutate();
                onClose();
            } else {
                toast.error("Gagal menambahkan kategori");
            }
        } catch (error: any) {
            toast.error(error.message || "Gagal menambahkan kategori");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Kategori Kegiatan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Kategori</Label>
                        <Input
                            id="nama"
                            placeholder="e.g. Webinar, Seminar, Sertifikasi"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
