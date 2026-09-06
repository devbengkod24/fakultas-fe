"use client";

import { MinatService } from "@/api/bimbingan-karir";
import { ColumnDef } from "@tanstack/react-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Minat {
    id: number;
    nama_minat: string;
    created_at?: string;
    updated_at?: string;
}

const DeleteMinat = ({ row, mutate }: { row: any; mutate: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await MinatService.destroy(row.original.id);
            if (res.success) {
                toast.success(res.message);
                mutate();
                setOpen(false);
            } else {
                toast.error(res.message || "Gagal menghapus minat");
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || e.message || "Gagal menghapus minat");
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
                    <AlertDialogTitle>Hapus Minat</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus minat "{row.original.nama_minat}"? Tindakan ini tidak dapat dibatalkan.
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
): ColumnDef<Minat>[] => {
    return [
        {
            header: "No",
            cell: ({ row }) => {
                return <div>{row.index + 1}</div>;
            },
        },
        {
            accessorKey: "nama_minat",
            header: "Nama Minat",
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                return <DeleteMinat row={row} mutate={mutate} />;
            },
        }
    ];
};