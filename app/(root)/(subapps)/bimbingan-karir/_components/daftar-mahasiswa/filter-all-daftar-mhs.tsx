"use client";

import { RefreshCw, MoreVertical, Download, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import FileImportPopup from "./file-import-popup";
import SearchControl from "@/components/search-control";
import { Button } from "@/components/ui/button";
import MinatMahasiswa from "./minat";
import { useState } from "react";
import { DaftarMhsService, MinatMhsService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import { Minat } from "@/types/bimbingan-karir/koordinator/daftar-mahasiswa/daftar-mahasiswa";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";

interface FilterAllDaftarMhsProps {
  minatMhs: string;
  mutate: () => void;
  isSyncing: boolean;
  handleSync: () => void;
}

const fetcherMinat = (activeProdiId: number | null) => {
  return MinatMhsService.getMinat(activeProdiId).then((res) => res)
}

export function FilterAllDaftarMhs({
  minatMhs,
  mutate,
  isSyncing,
  handleSync
}: FilterAllDaftarMhsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleMinatChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("minat", value);
    } else {
      params.delete("minat");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await DaftarMhsService.getExportDaftarMhs();
      const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "daftar-mahasiswa.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    } catch (error) {
      console.error("Export failed:", error);
      setExporting(false);
    }
  };

  const { data, isLoading: isLoadingMinat, mutate: mutateMinat } = useSWR(
    ["minat-mahasiswa-filter", activeProdiId],
    () => fetcherMinat(activeProdiId),
    { revalidateOnFocus: false, dedupingInterval: 500 }
  )

  const minatList: Minat[] = data?.data || []


  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2 items-center w-full">
          <SearchControl placeholder="Cari NIM atau Nama Mahasiswa..." className="w-full md:w-80 xl:w-80" />
        </div>

        <div className="flex items-center gap-2 h-10 shrink-0">
          {/* Minat Mahasiswa */}
          <Select
            value={minatMhs}
            onValueChange={handleMinatChange}
            disabled={isLoadingMinat}
          >
            <SelectTrigger className="w-[190px] h-full gap-1">
              <div className="flex items-center gap-2">
                {isLoadingMinat ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                <span>
                  {minatMhs === "semua"
                    ? "Minat Mahasiswa"
                    : `${minatMhs}`}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              {minatList && minatList.length > 0 ? (
                minatList.map((minat) => (
                  <SelectItem key={minat.id} value={minat.nama_minat}>
                    {minat.nama_minat}
                  </SelectItem>
                ))
              ) : (
                !isLoadingMinat && (
                  <SelectItem value="no-data" disabled>
                    Tidak ada data minat
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <MinatMahasiswa/>

          {/* Import Dialog tetap ada, tapi trigger-nya dari dropdown */}
          <FileImportPopup mutate={mutate} open={showImportDialog} onOpenChange={setShowImportDialog} />

          <Button
            onClick={handleSync}
            variant="default"
            className="flex items-center gap-2"
            disabled={isSyncing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            Sync Data
          </Button>

          {/* Dropdown untuk Import/Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Import Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </>
  );
}