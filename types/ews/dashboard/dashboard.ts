export type DashboardGlobalStatistic = {
    total_mahasiswa: number;
    total_mahasiswa_aktif: number;
    total_mahasiswa_mangkir: number;
    total_mahasiswa_do: number;
};

export type DashboardIpkChartItem = {
  tahun: string;
  rata_ipk: number;
};

export type DashboardKelulusanChartItem = {
    status: string;
    total: number;
    color?: string;
};

export type DashboardMahasiswaItem = {
  nim: string;
  nama: string;
  ipk: number;
  status: string;
};

export type DashboardProdiSummary =
{
    program_studi: string;
    total_mahasiswa: number;
    rata_ipk: number;
    total_lulus: number;
    eligible: number;
    tidak_eligible: number;
    mahasiswa: DashboardMahasiswaItem[];
};

export type DashboardAnnouncementItem = {
    id: number;
    title: string;
    date: string;
};

export type DashboardActivityLogItem = {
    id: number;
    title: string;
    created_at: string;
};

export type DashboardResponse = {
  statistik_global: DashboardGlobalStatistic;

  rata_ipk_per_tahun:
    DashboardIpkChartItem[];

  statistik_kelulusan:
    DashboardKelulusanChartItem[];

  tabel_ringkasan_prodi:
    DashboardProdiSummary[];
};