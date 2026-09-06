"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { EWSDashboardService } from "@/api/ews";
import { handleToastResponse } from "@/lib/toast-response";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RecalculatePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRecalculate = async () => {
    try {
      setIsLoading(true);
      const res = await EWSDashboardService.recalculateAllStatus();
      
      handleToastResponse({
        success: res.success,
        message: res.message || "Proses recalculate dimulai di background."
      });
    } catch (error: any) {
      handleToastResponse({
        success: false,
        message: error.message || "Terjadi kesalahan saat memulai recalculate."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <DashboardHeader 
        breadcrumbItems={[
          { name: "Dashboard", url: "/ews" },
          { name: "Recalculate EWS", url: "/ews/recalculate" }
        ]}
        titleItems={[
          { title: "Recalculate Status EWS", subtitle: "Sinkronisasi dan hitung ulang status EWS mahasiswa" }
        ]}
      />

      <div className="flex flex-col gap-6 mt-2">
        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sinkronisasi & Perhitungan Ulang EWS</h2>
            <p className="text-slate-600">
              Tombol ini digunakan untuk menghitung ulang status peringatan akademik (EWS) bagi 
              <strong> seluruh mahasiswa di Fakultas</strong> secara massal.
            </p>
          </div>

          <Alert className="bg-white border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold">Informasi Penting</AlertTitle>
            <AlertDescription className="text-amber-700">
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Sistem akan mengambil data KHS (Kartu Hasil Studi) terbaru dari setiap mahasiswa.</li>
                <li>Proses perhitungan berjalan di background (asynchronous) karena melibatkan ribuan data.</li>
                <li>Perubahan status mungkin membutuhkan waktu beberapa menit untuk tampil di dashboard.</li>
                <li>Gunakan fitur ini setelah periode input nilai selesai atau menjelang evaluasi akademik.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <Button 
              onClick={handleRecalculate} 
              disabled={isLoading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Memulai Proses...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Recalculate Semua Mahasiswa
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
