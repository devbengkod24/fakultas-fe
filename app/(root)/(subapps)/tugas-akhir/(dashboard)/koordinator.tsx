import CoordinatorMenu from "../_components/dashboard/coordinator-menu";
import CoordinatorQuota from "../_components/dashboard/coordinator-quota";
import Periode from "../_components/dashboard/periode";
import CoordinatorPengajuanDashboard from "../_components/dashboard/coordinator-pengajuan";
import DashboardActivityLog from "../_components/dashboard/log";
import CoordinatorLogbookChart from "../_components/dashboard/coordinator-logbook";
import { TaChart } from "../_components/dashboard/ta-chart";
import GlobalGroupLink from "../_components/dashboard/link-group";
import GelombangAktifKoor from "../_components/dashboard/gelombang-aktif-koor";

const DashboardKoordinator = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col lg:col-span-8">
          {/* Menu */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CoordinatorMenu />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-12">
            <div className="col-span-6 min-w-0 rounded-xl border">
              <CoordinatorLogbookChart />
            </div>
            <div className="col-span-6 min-w-0 rounded-xl border">
              {/* <StudentGrowthChart /> */}
              <TaChart />
            </div>
          </div>
          <div className="mt-4 flex-1 rounded-xl border p-6">
            <div className="mb-4">
              <h2 className="font-semibold">Data Pengajuan Bimbingan </h2>
              <p className="text-sm text-gray-500">
                Berikut adalah data-data bimbingan terbaru yang diajukan oleh
                mahasiswa
              </p>
            </div>
            <CoordinatorPengajuanDashboard />
          </div>
        </div>
        {/* Right Side */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          <Periode />
          <GelombangAktifKoor />
          <CoordinatorQuota />
          <GlobalGroupLink />
          <div className="flex-1">
            <DashboardActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKoordinator;
