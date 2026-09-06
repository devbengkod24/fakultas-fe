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
import { MinatService } from "@/api/bimbingan-karir";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";

interface ModalManajemenMinatProps {
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

export function ModalManajemenMinat({
    isOpen,
    onClose,
    mutate,
}: ModalManajemenMinatProps) {
    const { activeProdiId } = useProfile();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_minat: "",
        prodi_id: activeProdiId,
    });

    const handleClose = () => {
        setFormData({ nama_minat: "", prodi_id: activeProdiId });
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, prodi_id: activeProdiId };
            const response = await MinatService.store(payload);
            if (response.success) {
                toast.success(response.message || "Minat berhasil ditambahkan");
                setFormData({ nama_minat: "", prodi_id: activeProdiId });
                mutate();
                onClose();
            } else {
                toast.error(response.message || "Gagal menambahkan minat");
            }
        } catch (error: any) {
            toast.error(error.message || "Gagal menambahkan minat");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Minat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama_minat">Nama Minat</Label>
                        <Input
                            id="nama_minat"
                            placeholder="e.g. Web Development, Mobile Development"
                            value={formData.nama_minat}
                            onChange={(e) => setFormData({ ...formData, nama_minat: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
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