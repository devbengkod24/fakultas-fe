/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/context/profileUseContext";
import {
  isGeneralProdiFilter,
  useProdiFilter,
} from "@/context/prodiFilterContext";
import { EWSDashboardService } from "@/api/ews";

const DashboardExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { profile } = useProfile();
  const role = profile?.roles;
  const { selectedProdiIds } = useProdiFilter();
  const prodiIdParam = isGeneralProdiFilter(selectedProdiIds)
    ? undefined
    : selectedProdiIds.join(",");

  const handleExport = () => {
    setIsExporting(true);

    const exportTask =
      role === "super_fakultas"
        ? EWSDashboardService.exportSuperFakultasDashboard({
            prodi_id: prodiIdParam,
          })
        : EWSDashboardService.exportAdminDashboard({
            prodi_id: prodiIdParam,
          });

    exportTask
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-dashboard-${role}-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => {
        console.error("Export failed:", error);
        alert("Export gagal: " + error.message);
      })
      .finally(() => setIsExporting(false));
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export XLSX
    </Button>
  );
};

export default DashboardExport;
