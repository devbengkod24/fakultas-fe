import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuDashboardItem } from '@/types/bimbingan-karir/koordinator/dashboard/koordinator/dashboard';
import { Users, ClipboardList, CalendarClock } from 'lucide-react';

interface MenuDashboardProps {
  data?: MenuDashboardItem;
}

const MenuDashboard = ({ data }: MenuDashboardProps) => {
  return (
    <>
      {/* Total Mahasiswa */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Mahasiswa
          </CardTitle>
          <Users className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">
            {data?.total_mahasiswa?.toString() || "0"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Jumlah mahasiswa yang terdaftar
          </p>
        </CardContent>
      </Card>

      {/* Total Kegiatan */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Kegiatan
          </CardTitle>
          <ClipboardList className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">
            {data?.total_kegiatan?.toString() || "0"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Jumlah kegiatan yang tersedia
          </p>
        </CardContent>
      </Card>

      {/* Periode Saat Ini */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Periode Saat Ini
          </CardTitle>
          <CalendarClock className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">
            {data?.periode_saat_ini?.tahun_ajaran.toString() || "-"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Semester aktif saat ini
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default MenuDashboard;
