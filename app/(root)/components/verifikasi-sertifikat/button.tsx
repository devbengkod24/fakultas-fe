"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle2 } from "lucide-react";
import { VerifikasiSertifikatLandingPageServices } from "@/api/superadmin";
import { toast } from "sonner";
import Image from "next/image";

interface SertifikatData {
  kode_sertifikat: string;
  nama_mahasiswa: string;
  nim: string;
  foto: string;
  tanggal_terbit: string;
}

export function VerifikasiSertifikatButton() {
  const [kodeSertifikat, setKodeSertifikat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sertifikatData, setSertifikatData] = useState<SertifikatData | null>(null);

  const handleVerifikasi = async () => {
    if (!kodeSertifikat.trim()) {
      toast.error("Kode sertifikat tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setSertifikatData(null);
    
    try {
      const formData = new FormData();
      formData.append('kode_sertifikat', kodeSertifikat);
      
      const response = await VerifikasiSertifikatLandingPageServices.createVerifikasiSertifikat(formData);

      if (response.success) {
        toast.success(response.message);
        setSertifikatData(response.data);
      } else {
        toast.error(response.message || "Sertifikat tidak valid");
      }
    } catch (error) {
      console.error("Error verifikasi sertifikat:", error);
      toast.error("Gagal memverifikasi sertifikat. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="kode-sertifikat">Kode Sertifikat</Label>
        <Input
          id="kode-sertifikat"
          type="text"
          placeholder="Masukkan kode sertifikat"
          value={kodeSertifikat}
          onChange={(e) => setKodeSertifikat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleVerifikasi();
            }
          }}
        />
      </div>
      <Button onClick={handleVerifikasi} disabled={isLoading} className="w-full gap-2">
        <Search className="h-4 w-4" />
        {isLoading ? "Memverifikasi..." : "Cek Sertifikat"}
      </Button>

      {sertifikatData && (
        <div className="mt-4 p-6 border rounded-lg bg-card space-y-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Sertifikat Valid</h3>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2">
              <Image
                src={sertifikatData.foto}
                alt={sertifikatData.nama_mahasiswa}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="w-full space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nama Mahasiswa</p>
                <p className="font-semibold">{sertifikatData.nama_mahasiswa}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">NIM</p>
                <p className="font-semibold">{sertifikatData.nim}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Kode Sertifikat</p>
                <p className="font-semibold font-mono text-sm">{sertifikatData.kode_sertifikat}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Terbit</p>
                <p className="font-semibold">{sertifikatData.tanggal_terbit}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}