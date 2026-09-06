import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Student } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/student"

export const Columns = (currentPage: number, perPage: number, onToggle: (user_id: number) => void, submittingId: number | null): ColumnDef<Student>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "nim",
      header: "NIM",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const presensi = row.original.presensi;
        if (presensi === "izin") {
          return <Badge variant="secondary">Izin</Badge>;
        }
        return (
          <Badge variant={row.original.isPresent ? "success" : "destructiveOutline"}>
            {row.original.isPresent ? "Hadir" : "Tidak Hadir"}
          </Badge>
        );
      },
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const isLoading = submittingId === row.original.user_id;
        const isPresent = row.original.isPresent;
        const isIzin = row.original.presensi === "izin";
  
        return (
          <Button
            variant={isPresent ? "destructiveOutline" : "successOutline"}
            size="sm"
            onClick={() => onToggle(row.original.user_id)}
            disabled={isLoading || isIzin}
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-4" />
            ) : isPresent ? (
              <X size={16} />
            ) : (
              <Check size={16} />
            )}
          </Button>
        );
      }
    }
  ]
}