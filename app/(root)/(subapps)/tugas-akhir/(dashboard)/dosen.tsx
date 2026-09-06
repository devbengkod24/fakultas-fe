import DashboardMenu from "../_components/dashboard/menu";
import LogbookChart from "../_components/dashboard/logbook";
import DashboardQuota from "../_components/dashboard/quota";
import DashboardAnnouncements from "../_components/dashboard/announcement";
import DashboardActivityLog from "../_components/dashboard/log";
import { TaChart } from "../_components/dashboard/ta-chart";
import LogbookPending from "../_components/dashboard/logbook-pending";
import Periode from "../_components/dashboard/periode";
import GlobalGroupLink from "../_components/dashboard/link-group";
import GelombangAktifDosen from "../_components/dashboard/gelombang-aktif-dosen";

const DashboardDosen = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col lg:col-span-8">
          {/* Menu */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DashboardMenu />
          </div>

          {/* Chart */}
          <div className="mt-4 grid gap-4 xl:grid-cols-12">
            <div className="col-span-7 min-w-0 rounded-xl border">
              <LogbookChart />
            </div>
            <div className="col-span-5 min-w-0 rounded-xl border">
              <TaChart />
            </div>
          </div>

          <div className="mt-4 flex flex-1 flex-col rounded-xl border p-6">
            <div className="mb-4">
              <h2 className="font-semibold">Data Logbook Mahasiswa </h2>
              <p className="text-sm text-gray-500">
                Berikut adalah data-data logbook terbaru yang diajukan oleh
                mahasiswa yang perlu di-ACC
              </p>
            </div>
            <div className="flex-1">
              <LogbookPending />
            </div>
          </div>
        </div>
        {/* Left Side */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          <Periode />
          <GelombangAktifDosen />
          <DashboardQuota />
          <GlobalGroupLink />
          <DashboardAnnouncements />
          <div className="flex-1">
            <DashboardActivityLog maxHeightClassName="max-h-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDosen;
