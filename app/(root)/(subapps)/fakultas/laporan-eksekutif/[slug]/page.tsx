"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  HeartHandshake,
  GraduationCap,
  Download,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { CustomTabs } from "@/components/custom-tabs";
import { ManajemenProdiPublicService } from "@/api/public/manajemen-prodi";
import {
  PeriodeFakultasService,
  LaporanEksekutifFakultasService,
} from "@/api/fakultas";
import TaTab from "../../_components/dashboard/ta-tab";
import KpTab from "../../_components/dashboard/kp-tab";
import BkTab from "../../_components/dashboard/bk-tab";
import type { ProdiData } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";
import type { ProdiDetailResponse } from "@/types/fakultas/laporan-eksekutif";

function getProdiName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const LaporanEksekutifProdiPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [prodi, setProdi] = useState<ProdiData | null>(null);
  const [periodeId, setPeriodeId] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("ta");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const response = await ManajemenProdiPublicService.getAll({
          limit: 100,
        });
        const rawData =
          response?.data?.data ?? response?.data ?? response ?? [];
        const list: ProdiData[] = Array.isArray(rawData) ? rawData : [];
        const found = list.find((p) => p.kode_prodi.toLowerCase() === slug);
        setProdi(found || null);
      } catch (error) {
        console.error("Error fetching prodi:", error);
      }
    };
    fetchProdi();
  }, [slug]);

  const { data: periodeResponse } = useSWR(
    ["laporan-eksekutif-periode-list"],
    () => PeriodeFakultasService.getAll(1, 100),
    { revalidateOnFocus: false }
  );
  const periodeList =
    periodeResponse?.data?.data ?? periodeResponse?.data ?? [];

  const {
    data: detailResponse,
    error: detailError,
    isLoading: detailLoading,
  } = useSWR(
    prodi ? ["laporan-eksekutif-prodi-detail", prodi.id, periodeId] : null,
    () => LaporanEksekutifFakultasService.getProdiDetail(prodi!.id, periodeId),
    { revalidateOnFocus: false }
  );

  const detail: ProdiDetailResponse | undefined = detailResponse?.data;

  // Sinkronkan dropdown ke periode aktif dari response saat belum ada pilihan manual
  useEffect(() => {
    if (!periodeId && detail?.periode?.id) {
      setPeriodeId(detail.periode.id);
    }
  }, [detail?.periode?.id, periodeId]);

  const prodiName = prodi?.nama || getProdiName(slug);

  const handleExportPdf = async () => {
    if (!detail) return;
    setIsExporting(true);
    try {
      const blob = await LaporanEksekutifFakultasService.exportPdf(
        detail.prodi.id,
        periodeId
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan-Eksekutif-${detail.prodi.kode_prodi}-${detail.periode.kode_periode}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF berhasil diunduh");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Gagal mengunduh PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const tabs = [
    { status: "ta", label: "Tugas Akhir (TA)", icon: GraduationCap },
    { status: "kp", label: "Kerja Praktek (KP)", icon: Briefcase },
    { status: "bk", label: "Bimbingan Karir (BK)", icon: HeartHandshake },
  ];

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Laporan Eksekutif", url: "/fakultas/laporan-eksekutif" },
          {
            name: prodiName,
            url: `/fakultas/laporan-eksekutif/${slug}`,
          },
        ]}
        titleItems={[
          {
            title: `Laporan Eksekutif`,
            subtitle: detail?.periode
              ? `Periode ${detail.periode.tahun_ajaran}`
              : "Memuat periode...",
          },
        ]}
        rightContent={
          <div className="flex items-center gap-2">
            {periodeList.length > 0 && (
              <Select
                value={periodeId ? String(periodeId) : undefined}
                onValueChange={(value) => setPeriodeId(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  {periodeList.map(
                    (p: { id: number; tahun_ajaran: string }) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.tahun_ajaran}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
            <Button
              size="sm"
              disabled={!detail || isExporting}
              onClick={handleExportPdf}
            >
              {isExporting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1 h-4 w-4" />
              )}
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Prodi badge with gelar */}
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="default" className="text-xs uppercase tracking-wide">
          {prodi?.gelar || "S1"}
        </Badge>
        <span className="text-sm font-semibold text-muted-foreground">
          {prodiName}
        </span>
      </div>

      {detailLoading && (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!detailLoading && (detailError || !detail) && (
        <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-8 w-8" />
          <p>Data laporan eksekutif tidak dapat dimuat.</p>
        </div>
      )}

      {!detailLoading && detail && (
        <div className="flex flex-col gap-4 pb-6">
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-2">
            {activeTab === "ta" && <TaTab prodiId={detail.prodi.id} />}
            {activeTab === "kp" && <KpTab prodiId={detail.prodi.id} />}
            {activeTab === "bk" && <BkTab prodiId={detail.prodi.id} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanEksekutifProdiPage;
