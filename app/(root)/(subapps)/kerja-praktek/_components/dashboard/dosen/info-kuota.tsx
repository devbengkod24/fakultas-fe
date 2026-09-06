import { Card, CardTitle, CardDescription} from "@/components/ui/card";
import { DashboardDosen } from "@/types/kerja-praktek/dashboard";
import { CheckCircle, ClipboardList, GraduationCap, User } from "lucide-react";

const DashboardDosenInfoKuota = ({ data }: { data: DashboardDosen }) => {
  const kuotaData = data?.kuota || {
    total_kuota: 0,
    total_pengajuan: 0,
    ajuan_diterima: 0,
    sisa_kuota: 0
  };

  const cardData = [
    {
      title: "Total Kuota",
      icon: GraduationCap,
      count: kuotaData.total_kuota,
      color: "blue",
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      titleColor: "text-blue-500",
    },
    {
      title: "Sisa Kuota",
      icon: User,
      count: kuotaData.sisa_kuota,
      color: "orange",
      bg: "bg-orange-500/10",
      iconBg: "bg-orange-500/10 text-orange-500",
      titleColor: "text-orange-500",
    },
    {
      title: "Total Pengajuan",
      icon: ClipboardList,
      count: kuotaData.total_pengajuan,
      color: "yellow",
      bg: "bg-yellow-500/10",
      iconBg: "bg-yellow-500/10 text-yellow-500",
      titleColor: "text-yellow-500",
    },
    {
      title: "Jumlah Diterima",
      icon: CheckCircle,
      count: kuotaData.ajuan_diterima,
      color: "green",
      bg: "bg-green-500/10",
      iconBg: "bg-green-500/10 text-green-500",
      titleColor: "text-green-500",
    },
  ];

  return (
    <Card className="shadow-none col-span-4 mb-2 p-4 mt-2 rounded-md">
      <p className="font-medium text-sm mb-4">Informasi Kuota Bimbingan</p>
      <div className="grid grid-cols-2 gap-3 items-center">
        {cardData.map((card, index) => {
          return (
            <div key={index} className={`${card.bg} rounded-xl p-2.5`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <card.icon className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className={`${card.titleColor}`}>
                    {card.count}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {card.title}
                  </CardDescription>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DashboardDosenInfoKuota;
