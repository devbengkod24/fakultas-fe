"use client"

import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react"

interface ComparisonMetricsProps {
  cardData?: {
    selisih_peserta: number;
    status_peserta: string;
    selisih_kelulusan: number;
    status_kelulusan: string;
    selisih_rata_rata: number;
    status_rata_rata: string;
  };
}

export function ComparisonMetrics({ cardData }: ComparisonMetricsProps) {
  const participantsDiff = cardData?.selisih_peserta ?? 0;
  const graduationDiff = cardData?.selisih_kelulusan ?? 0;
  const statusPeserta = cardData?.status_peserta ?? "sama";
  const statusKelulusan = cardData?.status_kelulusan ?? "sama";
  const selisihRata = cardData?.selisih_rata_rata ?? 0;
  const statusRata = cardData?.status_rata_rata ?? "sama";


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-muted-foreground">Perbedaan Rating</h3>
          {statusRata === "lebih tinggi" && (
            <Badge>
              <ArrowUp className="h-3 w-3 mr-1" />
              Lebih tinggi
            </Badge>
          )}
          {statusRata === "lebih rendah" && (
            <Badge variant="destructiveOutline">
              <ArrowDown className="h-3 w-3 mr-1" />
              Lebih rendah
            </Badge>
          )}
          {statusRata === "sama" && (
            <Badge variant="primary">
              Tidak ada perbedaan
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold mt-2">{Math.abs(selisihRata)} %</p>
        <p className="text-xs text-muted-foreground mt-1">
          Periode kedua memiliki rating yang <span className="font-semibold">{statusRata}</span> dibanding periode pertama.
        </p>
      </div>

      {/* Card 2: Perbedaan Peserta */}
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-muted-foreground">Perbedaan Peserta</h3>
          {statusPeserta === "lebih banyak" && (
            <Badge>
              <ArrowUp className="h-3 w-3 mr-1" />
              Lebih banyak
            </Badge>
          )}
          {statusPeserta === "lebih sedikit" && (
            <Badge variant="destructiveOutline">
              <ArrowDown className="h-3 w-3 mr-1" />
              Lebih sedikit
            </Badge>
          )}
          {statusPeserta === "sama" && (
            <Badge variant="primary">
              Tidak ada perbedaan
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold mt-2">{Math.abs(participantsDiff)} orang</p>
        <p className="text-xs text-muted-foreground mt-1">
          Periode kedua memiliki peserta <span className="font-semibold">{statusPeserta}</span> peserta dibanding periode pertama.
        </p>
      </div>


      {/* Card 3: Perbedaan Kelulusan */}
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-muted-foreground">Perbedaan Kelulusan</h3>
          {statusKelulusan === "lebih banyak" && (
            <Badge>
              <ArrowUp className="h-3 w-3 mr-1" />
              Lebih banyak
            </Badge>
          )}
          {statusKelulusan === "lebih sedikit" && (
            <Badge variant="destructiveOutline">
              <ArrowDown className="h-3 w-3 mr-1" />
              Lebih sedikit
            </Badge>
          )}
          {statusKelulusan === "sama" && (
            <Badge variant="primary">
              Tidak ada perbedaan
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold mt-2">{Math.abs(graduationDiff)}%</p>
        <p className="text-xs text-muted-foreground mt-1">
          Periode kedua memiliki tingkat kelulusan <span className="font-semibold">{statusKelulusan}</span> dibanding periode pertama.
        </p>
      </div>
    </div>
  );
}
