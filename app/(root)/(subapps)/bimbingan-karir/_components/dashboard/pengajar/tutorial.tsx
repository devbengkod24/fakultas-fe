import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const Tutorial = () => {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Info className="h-4 w-4" />
          Tips untuk Pengajar
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2 text-muted-foreground">
        <p>1. Buka presensi QR sebelum kegiatan dimulai agar mahasiswa bisa absen.</p>
        <p>2. Tinjau izin presensi yang menunggu, setujui/tolak sebelum H-1 kegiatan.</p>
        <p>3. Pantau kehadiran mahasiswa bimbingan melalui kartu "Mahasiswa Bimbingan".</p>
      </CardContent>
    </Card>
  );
};

export default Tutorial;
