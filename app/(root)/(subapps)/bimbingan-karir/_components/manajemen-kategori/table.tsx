"use client"

import { DataTable } from "@/components/data-table"
import { Columns } from "./column"
import { FilterManajemenKategori } from "./filter"
import EmptyState from "@/components/empty-state"
import { AlertTriangle, FileX } from "lucide-react"
import { KategoriService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { useProfile } from "@/context/profileUseContext"
import { useEffect } from "react"

export function TablesManajemenKategori() {
    const { activeProdiId } = useProfile();
    const { data, error, isLoading, mutate } = useSWR(
        ["table-manajemen-kategori", activeProdiId],
        () => KategoriService.getAll(activeProdiId),
        { revalidateOnFocus: false, dedupingInterval: 0 }
    );

    useEffect(() => {
        if (mutate) {
            mutate();
        }
    }, [activeProdiId, mutate]);

    const daftarKategori = data?.data || [];

    if (error) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Gagal Memuat Data"
                subtitle="Terjadi kesalahan saat memuat data kategori. Silakan coba lagi."
                className="h-[400px]"
            />
        );
    }

    return (
        <div className="w-full">
            <div className="w-full flex gap-2 flex-col">
                <FilterManajemenKategori mutate={mutate} />
                {!isLoading && daftarKategori.length === 0 ? (
                    <EmptyState
                        icon={FileX}
                        title="Tidak Ada Data Manajemen Kategori"
                        subtitle="Belum ada data manajemen kategori yang tersedia. Silahkan tambahkan data kategori."
                        className="h-[400px]"
                    />
                ) : (
                    <DataTable
                        columns={Columns(mutate)}
                        data={daftarKategori}
                        loading={isLoading}
                    />
                )}
            </div>
        </div>
    )
}
