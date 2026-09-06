import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Users, FileText, GraduationCap } from "lucide-react";
import Link from "next/link";

const menu = [
  {
    title: "Kuota Dosen",
    subtitle: "Kelola kuota bimbingan dosen",
    link: "/kerja-praktek/kuota-dosen",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Pengajuan Mahasiswa",
    subtitle: "Kelola pengajuan kerja praktek",
    link: "/kerja-praktek/pengajuan-kp",
    icon: FileText,
    color: "text-purple-500",
  },
  {
    title: "Plotting Sidang",
    subtitle: "Atur jadwal sidang",
    link: "/kerja-praktek/plotting-jadwal",
    icon: GraduationCap,
    color: "text-green-500",
  },
];

const CoordinatorMenuKP = () => {
  return (
    <>
      {menu.map((item, index) => {
        return (
          <Card key={index} className="shadow-none">
            <CardHeader className="flex-col p-4 pb-2">
              <CardTitle className="flex items-center justify-between gap-2 font-medium text-gray-800">
                <p className="text-sm">{item.title}</p>
                <item.icon className={`size-4 ${item.color}`} />
              </CardTitle>
              <CardDescription>
                <p className="text-xs">{item.subtitle}</p>
              </CardDescription>
            </CardHeader>
            <Link href={item.link}>
              <div className="rounded-b-xl bg-blue-500/5 group">
                <div className="px-4 p-2 flex justify-between items-center text-primary text-xs">
                  <span>Lihat Selengkapnya</span>
                  <ChevronRight
                    strokeWidth={1.5}
                    className="size-4 translate-animation"
                  />
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </>
  );
};

export default CoordinatorMenuKP;
