import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export interface PengumumanItem {
  id: number;
  judul: string;
  konten: string;
  created_at: string | null;
}

interface PengumumanPengajarProps {
  data?: PengumumanItem[];
}

const formatDate = (input: string | null) => {
  if (!input) return "-";
  const date = new Date(input);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const PengumumanPengajar = ({ data }: PengumumanPengajarProps) => {
  const items = data ?? [];
  const isEmpty = items.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Pengumuman
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState icon={Megaphone} title="Tidak ada pengumuman" subtitle="Belum ada pengumuman untuk prodi Anda." />
        ) : (
          <ul className="space-y-3">
            {items.map((p) => (
              <li key={p.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <p className="font-medium text-sm">{p.judul}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{p.konten}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{formatDate(p.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default PengumumanPengajar;
