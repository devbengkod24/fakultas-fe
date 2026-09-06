import EmptyState from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users } from "lucide-react";

export interface KegiatanAkanDatangItem {
  id: number;
  nama_kegiatan: string;
  kategori: string;
  tanggal_mulai: string;
  waktu_mulai: string | null;
  lokasi: string | null;
  jumlah_mahasiswa_terdaftar: number;
}

interface KegiatanAkanDatangProps {
  data?: KegiatanAkanDatangItem[];
}

const formatDate = (input: string | Date) => {
  const date = new Date(input);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const KegiatanAkanDatang = ({ data }: KegiatanAkanDatangProps) => {
  const items = data ?? [];
  const isEmpty = items.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Kegiatan Akan Datang
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState icon={CalendarDays} title="Tidak ada kegiatan" subtitle="Belum ada kegiatan yang akan datang untuk prodi Anda." />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">{item.nama_kegiatan}</p>
                    <Badge variant="outline" className="text-xs capitalize">{item.kategori}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(item.tanggal_mulai)}{item.waktu_mulai && ` • ${item.waktu_mulai}`}
                    </span>
                    {item.lokasi && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />{item.lokasi}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Users className="h-3 w-3" />{item.jumlah_mahasiswa_terdaftar}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default KegiatanAkanDatang;
