"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FileText, CheckCircle } from "lucide-react";
import { CustomTabs } from "@/components/custom-tabs";
import PengajuanForm from "../_components/pengajuan-mahasiswa/mahasiswa/pengajuan-form";
import StatusPengajuan from "../_components/pengajuan-mahasiswa/mahasiswa/status-pengajuan";
import { Separator } from "@/components/ui/separator";
import { PengajuanMahasiswaService } from "@/api/tugas-akhir";

const fetcher = () =>
  PengajuanMahasiswaService.getPengajuanStatus().then((res) => res);

export default function PengajuanMahasiswa() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("status");

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR("pengajuan-status", fetcher, {
    dedupingInterval: 1000,
    shouldRetryOnError: false,
    errorRetryCount: 0,
  });

  const submissionStatus =
    response?.success && response.data ? response.data.status : null;

  const isPlotting =
    response?.success && response.data
      ? response.data.status === "accepted" && !response.data.jalur
      : false;

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["status", "pengajuan"].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      // Default to status tab if no tab param
      setActiveTab("status");
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Update URL with tab parameter while preserving other search params
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);

    // Refresh data when switching to status tab
    if (tab === "status") {
      mutate();
    }
  };

  const tabs = [
    {
      status: "status",
      label: "Status Pengajuan",
      icon: CheckCircle,
    },
    {
      status: "pengajuan",
      label: isPlotting ? "Form Kelengkapan" : "Form Pengajuan",
      icon: FileText,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "pengajuan":
        return (
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <FileText className="h-5 w-5" />
                {isPlotting
                  ? "Form Kelengkapan Tugas Akhir"
                  : "Form Pengajuan Tugas Akhir"}
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
              <PengajuanForm
                submissionStatus={submissionStatus}
                onTabChange={handleTabChange}
                mutate={mutate}
                isPlotting={isPlotting}
                plottingData={response?.data}
              />
            </CardContent>
          </Card>
        );
      case "status":
        return (
          <StatusPengajuan
            statusData={response?.data}
            loading={isLoading}
            error={error}
            onCreatePengajuan={() => handleTabChange("pengajuan")}
            mutateStatus={mutate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
}
