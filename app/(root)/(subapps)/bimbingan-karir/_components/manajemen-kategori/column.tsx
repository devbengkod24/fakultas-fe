"use client";

import { Kategori } from "@/api/bimbingan-karir/koordinator/kategori/kategori";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { KategoriService } from "@/api/bimbingan-karir";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const ToggleActive = ({ row, mutate }: { row: any; mutate: () => void }) => {
    const [loading, setLoading] = useState(false);
    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await KategoriService.toggleActive(row.original.id);
            if (res.success) {
                toast.success(res.message);
                mutate();
            } else {
                toast.error("Gagal mengubah status kategori");
            }
        } catch (e: any) {
            toast.error(e.message || "Gagal mengubah status kategori");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Switch
            checked={row.original.is_active}
            onCheckedChange={handleToggle}
            disabled={loading}
        />
    );
};

const DeleteKategori = ({ row, mutate }: { row: any; mutate: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await KategoriService.destroy(row.original.id);
            if (res.success) {
                toast.success(res.message);
                mutate();
                setOpen(false);
            } else {
                toast.error(res.message || "Gagal menghapus kategori");
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || e.message || "Gagal menghapus kategori");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kategori "{row.original.nama}"? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const Columns = (
    mutate: () => void
): ColumnDef<Kategori>[] => {
    return [
        {
            header: "No",
            cell: ({ row }) => {
                return <div>{row.index + 1}</div>;
            },
        },
        {
            accessorKey: "nama",
            header: "Nama",
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <ToggleActive row={row} mutate={mutate} />
                        <span className={row.original.is_active ? "text-green-600 font-medium" : "text-gray-500"}>
                            {row.original.is_active ? "Aktif" : "Non-Aktif"}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                return <DeleteKategori row={row} mutate={mutate} />;
            },
        }
    ];
};
