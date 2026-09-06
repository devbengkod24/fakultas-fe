import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, FolderOpen, User, BookOpen } from "lucide-react";
import Link from "next/link";

const menu = [
  {
    title: "Pengajuan Mahasiswa",
    subtitle: "Pengajuan bimbingan mahasiswa",
    link: "/tugas-akhir/pengajuan-mahasiswa",
    icon: User,
    color: "text-orange-500",
  },
  {
    title: "Logbook Mahasiswa",
    subtitle: "Progress logbook mahasiswa",
    link: "/tugas-akhir/logbook",
    icon: BookOpen,
    color: "text-yellow-500",
  },

  {
    title: "Mahasiswa Sidang",
    subtitle: "Pengajuan sidang mahasiswa",
    link: "/tugas-akhir/sidang-ta1",
    icon: FolderOpen,
    color: "text-green-500",
  },
];

const DashboardMenu = () => {
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
              <div className="rounded-b-xl bg-blue-500/5 group cursor-pointer">
                <div className="px-4 p-2 flex justify-between items-center text-primary text-xs">
                  <span>Lihat Selengkapnya</span>
                  <ChevronRight
                    strokeWidth={1.5}
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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

export default DashboardMenu;
