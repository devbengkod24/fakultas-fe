"use client"

import { DataTable } from "@/components/data-table"
import { Columns } from "../column/column"
import { ModalManajemenMinat } from "../modal/modal"
import EmptyState from "@/components/empty-state"
import { AlertTriangle, FileX, Plus } from "lucide-react"
import { MinatService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useProfile } from "@/context/profileUseContext"

export function TablesManajemenMinat() {
    const { activeProdiId } = useProfile();
    const [modalOpen, setModalOpen] = useState(false)

    const { data, error, isLoading, mutate } = useSWR(
        ["table-manajemen-minat", activeProdiId],
        () => MinatService.getAll(activeProdiId).then((res) => res),
        { revalidateOnFocus: false, dedupingInterval: 500 }
    )

    const daftarMinat = data?.data || [];

    if (error) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Gagal Memuat Data"
                subtitle="Terjadi kesalahan saat memuat data minat. Silakan coba lagi."
                className="h-[400px]"
            />
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setModalOpen(true)} size="sm">
                    <Plus size={16} /> Tambah Minat
                </Button>
            </div>

            <div className="w-full flex gap-2 flex-col">
                {!isLoading && daftarMinat.length === 0 ? (
                    <EmptyState
                        icon={FileX}
                        title="Tidak Ada Data Minat"
                        subtitle="Belum ada data minat yang tersedia. Silahkan tambahkan data minat."
                        className="h-[400px]"
                    />
                ) : (
                    <DataTable
                        columns={Columns(mutate)}
                        data={daftarMinat}
                        loading={isLoading}
                    />
                )}
            </div>

            <ModalManajemenMinat
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                mutate={mutate}
            />
        </div>
    )
}