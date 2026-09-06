"use client";

import { DataTable } from "@/components/data-table";
import { GelombangTA } from "@/types/tugas-akhir/gelombang";
import { createGelombangColumns } from "./columns";

interface GelombangTableProps {
  data: GelombangTA[];
  onEdit: (gelombang: GelombangTA) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  page?: number;
  limit?: number;
}

export function GelombangTable({
  data,
  onEdit,
  onToggleStatus,
  onDelete,
  page = 1,
  limit = 10,
}: GelombangTableProps) {
  const columns = createGelombangColumns(onEdit, onToggleStatus, onDelete, page, limit);
  return <DataTable columns={columns} data={data} />;
}
