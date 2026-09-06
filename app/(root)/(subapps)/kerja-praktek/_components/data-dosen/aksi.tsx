"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExternalLink, Pencil, Trash } from "lucide-react"
import Link from "next/link"
import type { Dosen } from "@/types/kerja-praktek/dosen"

interface DosenActionsProps {
  dosen: Dosen
  onEdit: (dosen: Dosen) => void
  onDelete: (dosen: Dosen) => void
}

export const DaftarDosenAksi = ({ dosen, onEdit, onDelete }: DosenActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/kerja-praktek/data-dosen/${dosen.id}`}>
            <ExternalLink className="size-4 mr-2" />
            Lihat Detail
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(dosen)}>
          <div className="flex items-center gap-2">
            <Pencil className="size-4" />
            Edit
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(dosen)} className="text-destructive">
          <div className="flex items-center gap-2">
            <Trash className="size-4" />
            Hapus
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
