import CoordinatorMenuKP from "../_components/dashboard/koordinator/coordinator-menu-kp";
import CoordinatorQuotaKP from "../_components/dashboard/koordinator/coordinator-quota-kp";
import PeriodeKP from "../_components/dashboard/koordinator/periode-kp";
import DashboardLogAktivitas from "../_components/dashboard/log-aktivitas";
import CoordinatorLogbookChart from "../_components/dashboard/koordinator/logbook-chart";
import CoordinatorDistributionChart from "../_components/dashboard/koordinator/distribution-chart";
import GlobalGroupLink from "../_components/dashboard/koordinator/link-group";
import CoordinatorSummaryCards from "../_components/dashboard/koordinator/summary-cards";
import GelombangAktifKoor from "../_components/dashboard/koordinator/gelombang-aktif-koor";

const DashboardKoordinator = () => {
  return (
    <div>
      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 flex flex-col lg:col-span-8">
          {/* Menu */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CoordinatorMenuKP />
          </div>

          <div className="mt-4 grid flex-1 gap-4 xl:grid-cols-12">
            <div className="col-span-6 rounded-xl border">
              <CoordinatorLogbookChart />
            </div>
            <div className="col-span-6 rounded-xl border">
              <CoordinatorDistributionChart />
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
            <CoordinatorSummaryCards />
          </div>
        </div>
        {/* Right Side */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-4">
          <PeriodeKP />
          <GelombangAktifKoor />
          <CoordinatorQuotaKP />
          <GlobalGroupLink />
          <div className="flex-1">
            <DashboardLogAktivitas type="koordinator" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKoordinator;
