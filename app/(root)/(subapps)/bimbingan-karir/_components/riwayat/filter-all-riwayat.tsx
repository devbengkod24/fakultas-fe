"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FileExportPopup from "./file-export-popup"
import SearchControl from "@/components/search-control"
import { useRouter, useSearchParams } from "next/navigation";

interface FilterAllRiwayatProps {
  periode: number;
  periodeList?: { id: number; tahun_ajaran: string }[];
  periodeAktif?: { id: number; tahun_ajaran: string };
}

export function FilterAllRiwayat({
  periode,
  periodeList = [],
  periodeAktif,
}: FilterAllRiwayatProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleRiwayatChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("periode_id", value);
    } else {
      params.delete("periode_id");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // Tentukan nilai yang akan ditampilkan
  const displayValue = periode === 0 
    ? "" 
    : periode.toString();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2 items-center w-full">
          <SearchControl placeholder="Cari Riwayat..." className="w-full md:w-80 xl:w-80" />
        </div>

        <div className="flex items-center gap-2 h-10 shrink-0">
          <Select
            onValueChange={handleRiwayatChange}
            value={displayValue}
          >
            <SelectTrigger className="w-[250px] h-10">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Semua Periode</SelectItem>
              {periodeList.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.tahun_ajaran}
                  {periodeAktif?.id === p.id && " (Aktif)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FileExportPopup periode={periode}/>
        </div>
      </div>
    </>
  )
}
