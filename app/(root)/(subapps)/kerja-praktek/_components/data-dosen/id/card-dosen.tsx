import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, Users, IdCard } from "lucide-react";

interface DosenInfoCardProps {
  dosen: {
    npp: string;
    email: string;
    telp: string;
    currentStudents: number;
    quota: number;
  };
}

export function DaftarDosenCardDosen({ dosen }: DosenInfoCardProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Informasi Dosen</CardTitle>
        <CardDescription>
          Detail informasi dosen pembimbing kerja praktek
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-3 items-center">
          <span className="font-medium">NPP</span>
          <div className="col-span-2 flex items-center">
            <IdCard className="mr-2 h-4 w-4 text-muted-foreground" />
            {dosen.npp}
          </div>
        </div>
        <div className="grid grid-cols-3 items-center">
          <span className="font-medium">Email</span>
          <div className="col-span-2 flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${dosen.email}`} className="hover:underline">
              {dosen.email}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center">
          <span className="font-medium">No HP</span>
          <div className="col-span-2 flex items-center">
            <Phone className="mr-2 size-4 text-muted-foreground" />
            <a href={`tel:${dosen.telp}`} className="hover:underline">
              {dosen.telp || "-"}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center">
          <span className="font-medium">Kuota Bimbingan</span>
          <div className="col-span-2 flex items-center">
            <Users className="mr-2 size-4 text-muted-foreground" />
            {dosen.currentStudents} / {dosen.quota}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}