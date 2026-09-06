"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import type { Gelombang } from "@/types/kerja-praktek/gelombang"
import { Badge } from "@/components/ui/badge"


interface GelombangTableProps {
  data: Gelombang[]
  onEdit: (gelombang: Gelombang) => void
  onToggleStatus: (id: number) => void
  currentPage: number
  entriesPerPage: number
}

export function GelombangTable({ data, onEdit, onToggleStatus, currentPage, entriesPerPage }: GelombangTableProps) {
  const getStatusText = (status?: number) => {
    return (
      <Badge variant={status === 0 ? "destructiveOutline" : "success"} className="text-center">
        {status === 0 ? "Tidak Aktif" : "Aktif"}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Gelombang Sidang</TableHead>
            <TableHead>Tanggal Awal</TableHead>
            <TableHead>Tanggal Akhir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">
                {(currentPage - 1) * entriesPerPage + index + 1}
              </TableCell>
              <TableCell>{row.nama_gelombang}</TableCell>
              <TableCell>{row.tgl_awal}</TableCell>
              <TableCell>{row.tgl_akhir}</TableCell>
              <TableCell>{getStatusText(row.status)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => onEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <Switch
                    checked={row.status === 1}
                    onCheckedChange={() => onToggleStatus(row.id!)}
                    aria-label="Toggle status"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}