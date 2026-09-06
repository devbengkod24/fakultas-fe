"use client";

import EmptyState from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { configureHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { mutate } from "swr";
import { toast } from "sonner";
import { useState } from "react";

export interface IzinMenungguItem {
  id: number;
  mahasiswa_nama: string | null;
  nim: string | null;
  kegiatan_nama: string | null;
  kegiatan_id: number;
  alasan: string | null;
  bukti_izin: string | null;
  created_at: string | null;
}

interface IzinMenungguProps {
  data?: IzinMenungguItem[];
}

const formatDate = (input: string | null) => {
  if (!input) return "-";
  const date = new Date(input);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
};

const IzinMenunggu = ({ data }: IzinMenungguProps) => {
  const items = data ?? [];
  const isEmpty = items.length === 0;
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const postIzin = async (action: "terima" | "tolak", izinId: number) => {
    const headers = configureHeaders() as Headers;
    const res = await fetch(`${API_URL}/bk/izin-presensi/${action}?izin_id=${izinId}`, {
      method: "POST", headers,
    });
    return res.json();
  };

  const handleApprove = async (id: number) => {
    setLoadingId(id);
    try {
      const res = await postIzin("terima", id);
      if (res?.success) { toast.success("Izin disetujui"); mutate("dashboardPengajarBK"); }
      else toast.error(res?.message ?? "Gagal menyetujui izin");
    } catch (err: any) { toast.error(err?.message ?? "Gagal menyetujui izin"); }
    finally { setLoadingId(null); }
  };

  const handleReject = async (id: number) => {
    setLoadingId(id);
    try {
      const res = await postIzin("tolak", id);
      if (res?.success) { toast.success("Izin ditolak"); mutate("dashboardPengajarBK"); }
      else toast.error(res?.message ?? "Gagal menolak izin");
    } catch (err: any) { toast.error(err?.message ?? "Gagal menolak izin"); }
    finally { setLoadingId(null); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Izin Menunggu Persetujuan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState icon={Clock} title="Tidak ada izin menunggu" subtitle="Semua permohonan izin sudah diproses." />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="border-b pb-3 last:border-b-0 last:pb-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.mahasiswa_nama ?? "Mahasiswa tidak diketahui"}</p>
                    <p className="text-xs text-muted-foreground">{item.nim ?? "-"}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Menunggu</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium">Kegiatan:</span> {item.kegiatan_nama ?? "-"}</p>
                  <p><span className="font-medium">Alasan:</span> {item.alasan ?? "-"}</p>
                  <p className="text-[10px]">{formatDate(item.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" disabled={loadingId === item.id} onClick={() => handleApprove(item.id)} className="h-7 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />Setujui
                  </Button>
                  <Button size="sm" variant="outline" disabled={loadingId === item.id} onClick={() => handleReject(item.id)} className="h-7 text-xs">
                    <XCircle className="h-3 w-3 mr-1" />Tolak
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default IzinMenunggu;
