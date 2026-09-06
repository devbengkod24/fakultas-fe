"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ModalManajemenKategori } from "./modal"

export function FilterManajemenKategori({ mutate }: { mutate: () => void }) {
    const [openAddModal, setOpenAddModal] = useState(false)

    return (
        <>
            <div className="flex bg-white items-center justify-between border-b pb-4 pt-4">
                <div className="flex gap-2 w-full lg:w-fit items-center">
                    <h2 className="text-lg font-semibold">Daftar Kategori Kegiatan</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setOpenAddModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Kategori
                    </Button>
                </div>
            </div>
            <ModalManajemenKategori
                isOpen={openAddModal}
                onClose={() => setOpenAddModal(false)}
                mutate={mutate}
            />
        </>
    )
}
