import EmptyState from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Users } from "lucide-react";

export interface MahasiswaBimbinganItem {
  id: number;
  nim: string;
  nama: string;
  minat: string;
  total_hadir: number;
  total_kegiatan: number;
}

interface MahasiswaBimbinganProps {
  data?: MahasiswaBimbinganItem[];
}

const MahasiswaBimbingan = ({ data }: MahasiswaBimbinganProps) => {
  const items = data ?? [];
  const isEmpty = items.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Mahasiswa Bimbingan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState icon={Users} title="Belum ada mahasiswa" subtitle="Belum ada mahasiswa bimbingan untuk prodi Anda." />
        ) : (
          <ul className="space-y-3">
            {items.map((m) => {
              const attendancePct = m.total_kegiatan > 0 ? Math.round((m.total_hadir / m.total_kegiatan) * 100) : 0;
              return (
                <li key={m.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{m.nama}</p>
                    <p className="text-xs text-muted-foreground">{m.nim}</p>
                    <Badge variant="outline" className="text-xs mt-1">{m.minat}</Badge>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {m.total_hadir}/{m.total_kegiatan}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{attendancePct}% hadir</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default MahasiswaBimbingan;
