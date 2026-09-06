import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CalendarClock, ClipboardCheck } from "lucide-react";

interface MenuDashboardPengajarProps {
  data?: {
    total_mahasiswa_bimbingan?: number;
    total_kegiatan_periode_ini?: number;
    total_kegiatan_akan_datang?: number;
    total_izin_menunggu?: number;
  };
}

const MenuDashboardPengajar = ({ data }: MenuDashboardPengajarProps) => {
  return (
    <>
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mahasiswa Bimbingan</CardTitle>
          <Users className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{data?.total_mahasiswa_bimbingan?.toString() ?? "0"}</p>
          <p className="text-xs text-muted-foreground mt-2">Total mahasiswa di prodi Anda</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
          <ClipboardList className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{data?.total_kegiatan_periode_ini?.toString() ?? "0"}</p>
          <p className="text-xs text-muted-foreground mt-2">Kegiatan periode aktif</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Akan Datang</CardTitle>
          <CalendarClock className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{data?.total_kegiatan_akan_datang?.toString() ?? "0"}</p>
          <p className="text-xs text-muted-foreground mt-2">Kegiatan yang akan datang</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Izin Menunggu</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{data?.total_izin_menunggu?.toString() ?? "0"}</p>
          <p className="text-xs text-muted-foreground mt-2">Permohonan izin yang perlu approval</p>
        </CardContent>
      </Card>
    </>
  );
};

export default MenuDashboardPengajar;
