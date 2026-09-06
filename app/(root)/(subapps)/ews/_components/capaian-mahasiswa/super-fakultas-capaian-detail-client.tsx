/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import useSWR from "swr";
import { EWSCapaianMahasiswaService } from "@/api/ews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/pagination-control";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SuperFakultasCapaianDetailClient() {
  const searchParams = useSearchParams();
  const prodiId = searchParams.get("prodi_id");
  const prodiNama = searchParams.get("prodi_nama") || "";
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: response, error, isLoading } = useSWR(
    ["super-fakultas-tabel-capaian-detail"],
    () => EWSCapaianMahasiswaService.getSuperFakultasTabelCapaianDetail(),
    { revalidateOnFocus: false }
  );

  const handleExport = () => {
    setIsExporting(true);
    EWSCapaianMahasiswaService.exportSuperFakultasTabelCapaianDetail()
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-tabel-capaian-detail-super-fakultas-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => alert("Export gagal: " + error.message))
      .finally(() => setIsExporting(false));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">Gagal memuat data. Silakan coba lagi.</div>;
  }

  const allData = response?.data?.data || [];
  const filteredData = prodiId
    ? allData.filter((item: any) => item.prodi.id.toString() === prodiId)
    : allData;

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      
      <Card className="shadow-none border-none p-0">
        <CardHeader className="pt-6 flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>
              Detail Capaian Per Angkatan {prodiNama && <span className="text-gray-500 font-medium text-base ml-1">- {prodiNama}</span>}
            </CardTitle>
            <CardDescription className="text-sm">
              Detail capaian per tahun angkatan untuk program studi yang dipilih.
            </CardDescription>
          </div>
          <Button onClick={handleExport} disabled={isExporting} size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export XLSX
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Tahun Angkatan</TableHead>
                  <TableHead className="text-center">Tren IPS</TableHead>
                  <TableHead className="text-center">Rata-rata SKS Lulus</TableHead>
                  <TableHead className="text-center">Jml MK Gagal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item: any, index: number) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="font-medium">{(safePage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell className="font-bold text-[#2D3E50]">Angkatan {item.tahun_angkatan}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.tren_ips === "Naik" ? "success" : item.tren_ips === "Turun" ? "destructiveOutline" : "secondary"}>
                        {item.tren_ips === "Naik" ? <TrendingUp className="w-3 h-3" /> : item.tren_ips === "Turun" ? <TrendingDown className="w-3 h-3" /> : null}
                        {item.tren_ips}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-700">
                      {Math.ceil(item.rata_rata_sks_lulus || 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructiveOutline">
                        {item.jumlah_matakuliah_gagal}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">
              Tidak ada data tersedia untuk prodi ini.
            </div>
          )}
          {filteredData.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <PaginationControls
                currentPage={safePage}
                lastPage={totalPages}
                total={totalItems}
                defaultLimit={itemsPerPage}
                onPageChange={setCurrentPage}
                onLimitChange={(n) => {
                  setItemsPerPage(n);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




