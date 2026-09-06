import StatistikSummary from "../_components/dashboard/statistik-summary";
import RataIpkChart from "../_components/dashboard/rata-ipk-chart";
import StatistikKelulusanChart from "../_components/dashboard/statistik-kelulusan-chart";
import CapaianSummaryCard from "../_components/dashboard/capaian-summary";
import MahasiswaSummaryTable from "../_components/dashboard/mahasiswa-summary-table";

const DashboardAdmin = () => {
  return (
    <div className="space-y-4">
      <StatistikSummary />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="border rounded-xl xl:col-span-4">
          <RataIpkChart />
        </div>
        <div className="border rounded-xl xl:col-span-4">
          <StatistikKelulusanChart />
        </div>
        <div className="border rounded-xl xl:col-span-4">
          <CapaianSummaryCard />
        </div>
      </div>

      <MahasiswaSummaryTable />
    </div>
  );
};

export default DashboardAdmin;
