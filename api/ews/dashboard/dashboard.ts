/* eslint-disable @typescript-eslint/no-explicit-any */

const Dashboard = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: (options?: any) => Headers;
}) => {
  const dashboard = "/dashboard";

  return {
    getSuperFakultasDashboard: (params?: { prodi_id?: string }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();
      const url = `${baseUrl}/super-fakultas${dashboard}${qs ? `?${qs}` : ""}`;

      console.log("[EWSDashboardService.getSuperFakultasDashboard] Fetching...", url);

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(url, requestConfig)
        .then((response) => {
          console.log("[EWSDashboardService.getSuperFakultasDashboard] Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .then((res) => {
          console.log("[EWSDashboardService.getSuperFakultasDashboard] Raw response:", res);
          if (!res.success) return res;

          const raw = res.data || {};
          const mappedData = {
            statistik_global: {
              total_mahasiswa: Number(raw.statistik_global?.total_mahasiswa || 0),
              total_mahasiswa_aktif: Number(raw.statistik_global?.total_mahasiswa_aktif || 0),
              total_mahasiswa_mangkir: Number(raw.statistik_global?.total_mahasiswa_mangkir || 0),
              total_mahasiswa_cuti: Number(raw.statistik_global?.total_mahasiswa_cuti || 0),
              total_mahasiswa_tidak_aktif: Number(raw.statistik_global?.total_mahasiswa_tidak_aktif || 0),
              total_mahasiswa_do: Number(raw.statistik_global?.total_mahasiswa_do || 0),
            },
            rata_ipk_per_tahun: (raw.rata_ipk_per_tahun || []).map(
              (item: any) => ({
                tahun: String(item.tahun_masuk || item.tahun || ""),
                rata_ipk: Number(item.rata_ipk || 0),
                jumlah_mahasiswa: Number(item.jumlah_mahasiswa || 0),
              })
            ),
            statistik_kelulusan: {
              eligible: Number(raw.statistik_kelulusan?.eligible || 0),
              non_eligible: Number(raw.statistik_kelulusan?.non_eligible || 0),
            },
            tabel_ringkasan_prodi: (raw.tabel_ringkasan_prodi || []).map(
              (item: any) => ({
                prodi: item.prodi ?? {
                  id: item.prodi_id,
                  kode_prodi: item.kode_prodi,
                  nama_prodi: item.nama_prodi,
                },
                tahun_angkatan: item.tahun_angkatan || [],
                jumlah_mahasiswa: Number(item.jumlah_mahasiswa || 0),
                ipk_rata_rata: Number(item.ipk_rata_rata || 0),
                jumlah_mahasiswa_aktif: Number(
                  item.jumlah_mahasiswa_aktif || item.mahasiswa_aktif || 0
                ),
                jumlah_mahasiswa_cuti: Number(item.jumlah_mahasiswa_cuti || 0),
                jumlah_mahasiswa_mangkir: Number(item.jumlah_mahasiswa_mangkir || 0),
                jumlah_do: Number(item.jumlah_do || 0),
                jumlah_mahasiswa_tidak_aktif: Number(
                  item.jumlah_mahasiswa_tidak_aktif ||
                  item.jumlah_meninggal ||
                  0
                ),
                jumlah_tepat_waktu: Number(item.jumlah_tepat_waktu || 0),
                jumlah_normal: Number(item.jumlah_normal || 0),
                jumlah_perhatian: Number(item.jumlah_perhatian || 0),
                jumlah_kritis: Number(item.jumlah_kritis || 0),
                eligible: Number(item.eligible || 0),
                tidak_eligible: Number(item.tidak_eligible || 0),
              })
            ),
          };

          console.log("[EWSDashboardService.getSuperFakultasDashboard] Mapped data:", mappedData);
          return { ...res, data: mappedData };
        })
        .catch((error) => {
          console.error("[EWSDashboardService.getSuperFakultasDashboard] Error:", error);
          throw new Error(`Error fetching super-fakultas dashboard: ${error.message}`);
        });
    },

    getAdminDashboard: (params?: { prodi_id?: string }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();
      const url = `${baseUrl}/admin${dashboard}${qs ? `?${qs}` : ""}`;

      console.log("[EWSDashboardService.getAdminDashboard] Fetching...", url);

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(url, requestConfig)
        .then((response) => {
          console.log("[EWSDashboardService.getAdminDashboard] Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .then((res) => {
          console.log("[EWSDashboardService.getAdminDashboard] Raw response:", res);
          if (!res.success) return res;

          // Mapping data agar sesuai dengan type DashboardResponse di FE
          const raw = res.data || {};
          const mappedData = {
            statistik_global: {
              total_mahasiswa: Number(raw.statistik_global?.total_mahasiswa || 0),
              total_mahasiswa_aktif: Number(raw.statistik_global?.total_mahasiswa_aktif || 0),
              total_mahasiswa_mangkir: Number(raw.statistik_global?.total_mahasiswa_mangkir || 0),
              total_mahasiswa_cuti: Number(raw.statistik_global?.total_mahasiswa_cuti || 0),
              total_mahasiswa_tidak_aktif: Number(raw.statistik_global?.total_mahasiswa_tidak_aktif || 0),
              total_mahasiswa_do: Number(raw.statistik_global?.total_mahasiswa_do || 0),
            },
            rata_ipk_per_tahun: (raw.rata_ipk_per_tahun || []).map(
              (item: any) => ({
                tahun: String(item.tahun_masuk || item.tahun || ""),
                rata_ipk: Number(item.rata_ipk || 0),
                jumlah_mahasiswa: Number(item.jumlah_mahasiswa || 0),
              })
            ),
            statistik_kelulusan: {
              eligible: Number(raw.statistik_kelulusan?.eligible || 0),
              non_eligible: Number(raw.statistik_kelulusan?.non_eligible || 0),
            },
            // Admin: tabel_ringkasan_prodi.tahun is the array
            tabel_ringkasan_prodi: (
              raw.tabel_ringkasan_prodi?.tahun ||
              raw.tabel_ringkasan_prodi ||
              []
            ).map((item: any) => ({
              prodi: item.prodi ?? {
                id: item.prodi_id,
                kode_prodi: item.kode_prodi,
                nama_prodi: item.nama_prodi,
              },
              tahun_masuk: item.tahun_masuk,
              tahun_angkatan: item.tahun_angkatan || [],
              detail_per_prodi: item.detail_per_prodi || [],
              jumlah_mahasiswa: Number(item.jumlah_mahasiswa || 0),
              ipk_rata_rata: Number(item.ipk_rata_rata || 0),
              jumlah_mahasiswa_aktif: Number(
                item.jumlah_mahasiswa_aktif || item.mahasiswa_aktif || 0
              ),
              jumlah_mahasiswa_cuti: Number(item.jumlah_mahasiswa_cuti || 0),
              jumlah_mahasiswa_mangkir: Number(item.jumlah_mahasiswa_mangkir || 0),
              jumlah_do: Number(item.jumlah_do || 0),
              jumlah_mahasiswa_tidak_aktif: Number(
                item.jumlah_mahasiswa_tidak_aktif ||
                item.jumlah_meninggal ||
                0
              ),
              jumlah_tepat_waktu: Number(item.jumlah_tepat_waktu || 0),
              jumlah_normal: Number(item.jumlah_normal || 0),
              jumlah_perhatian: Number(item.jumlah_perhatian || 0),
              jumlah_kritis: Number(item.jumlah_kritis || 0),
              eligible: Number(item.eligible || 0),
              tidak_eligible: Number(item.tidak_eligible || 0),
            })),
          };

          console.log("[EWSDashboardService.getAdminDashboard] Mapped data:", mappedData);
          return { ...res, data: mappedData };
        })
        .catch((error) => {
          console.error("[EWSDashboardService.getAdminDashboard] Error:", error);
          throw new Error(`Error fetching admin dashboard: ${error.message}`);
        });
    },

    getAnnouncements: () => {
      const headers = config();

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(`${baseUrl}${dashboard}/announcements`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error fetching announcements: ${error.message}`);
        });
    },

    getActivityLogs: () => {
      const headers = config();

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(`${baseUrl}${dashboard}/activity-logs`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error fetching activity logs: ${error.message}`);
        });
    },

    // Get Mahasiswa by Status (for filtering from dashboard table)
    getMahasiswaByStatus: (params: {
      prodi_id?: string;
      tahun_masuk?: string;
      status_mahasiswa?: string;
      ews_status?: string;
      status_kelulusan?: string;
      page?: number;
      per_page?: number;
    }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      if (params.tahun_masuk)
        queryParams.append("tahun_masuk", params.tahun_masuk);

      // Map parameters correctly for dashboard criteria
      let criteria = params.status_mahasiswa || params.ews_status || params.status_kelulusan;
      if (criteria) queryParams.append("criteria", criteria);

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.per_page)
        queryParams.append("per_page", params.per_page.toString());

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(
        `${baseUrl}/super-fakultas/dashboard/mahasiswa?${queryParams.toString()}`,
        requestConfig
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .catch((error) => {
          throw new Error(
            `Error fetching mahasiswa by status: ${error.message}`
          );
        });
    },

    // Admin Dashboard Detail
    // Trigger bulk recalculate (Super Fakultas)
    recalculateAllStatus: (params?: { prodi_id?: string }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();
      const url = `${baseUrl}/super-fakultas/recalculate-all-status${qs ? `?${qs}` : ""}`;

      console.log("[EWSDashboardService.recalculateAllStatus] Fetching...", url);

      const requestConfig = {
        method: "POST",
        headers,
      };

      return fetch(url, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error("[EWSDashboardService.recalculateAllStatus] Error:", error);
          throw new Error(`Error recalculating status: ${error.message}`);
        });
    },

    getAdminDashboardDetail: () => {
      const headers = config();

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(`${baseUrl}/admin${dashboard}/detail`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .catch((error) => {
          throw new Error(
            `Error fetching admin dashboard detail: ${error.message}`
          );
        });
    },

    // Admin Mahasiswa by Status
    getAdminMahasiswaByStatus: (params: {
      tahun_masuk?: string;
      status_mahasiswa?: string;
      ews_status?: string;
      status_kelulusan?: string;
      page?: number;
      per_page?: number;
    }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params.tahun_masuk)
        queryParams.append("tahun_masuk", params.tahun_masuk);

      // Map parameters correctly for dashboard criteria
      let criteria = params.status_mahasiswa || params.ews_status || params.status_kelulusan;
      if (criteria) queryParams.append("criteria", criteria);

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.per_page)
        queryParams.append("per_page", params.per_page.toString());

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(
        `${baseUrl}/admin/mahasiswa/by-status?${queryParams.toString()}`,
        requestConfig
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .catch((error) => {
          throw new Error(
            `Error fetching admin mahasiswa by status: ${error.message}`
          );
        });
    },

    // Export SuperFakultas Dashboard
    exportSuperFakultasDashboard: (params?: { prodi_id?: string }): Promise<Blob> => {
      const headers = config({
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();
      const url = `${baseUrl}/super-fakultas/export/dashboard${qs ? `?${qs}` : ""}`;

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(url, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.blob();
        })
        .catch((error) => {
          throw new Error(`Error exporting super-fakultas dashboard: ${error.message}`);
        });
    },

    // Export Admin Dashboard
    exportAdminDashboard: (params?: { prodi_id?: string }): Promise<Blob> => {
      const headers = config({
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();
      const url = `${baseUrl}/admin/export/dashboard${qs ? `?${qs}` : ""}`;

      const requestConfig = {
        method: "GET",
        headers,
      };

      return fetch(url, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.blob();
        })
        .catch((error) => {
          throw new Error(`Error exporting admin dashboard: ${error.message}`);
        });
    },

    getSuperFakultasDashboardDetail: (params?: { prodi_id?: string }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);

      const requestConfig = {
        method: "GET",
        headers,
      };

      const url = `${baseUrl}/super-fakultas/dashboard/detail?${queryParams.toString()}`;
      console.log("[EWSDashboardService.getSuperFakultasDashboardDetail] Fetching...", url);

      return fetch(url, requestConfig)
        .then((response) => {
          console.log("[EWSDashboardService.getSuperFakultasDashboardDetail] Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response.json();
        })
        .then((res) => {
          console.log("[EWSDashboardService.getSuperFakultasDashboardDetail] Raw response:", res);
          if (res.success && res.data && !Array.isArray(res.data)) {
            res.data = [res.data];
          }
          return res;
        })
        .catch((error) => {
          console.error("[EWSDashboardService.getSuperFakultasDashboardDetail] Error:", error);
          throw new Error(
            `Error fetching super-fakultas dashboard detail: ${error.message}`
          );
        });
    },

    // Export SuperFakultas Dashboard Detail (Phase 6)
    exportSuperFakultasDashboardDetail: (params?: { prodi_id?: string }): Promise<Blob> => {
      const headers = config({ accept: "*/*", contentType: "none" });
      const queryParams = new URLSearchParams();
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();
      return fetch(`${baseUrl}/super-fakultas/export/dashboard/detail${qs ? `?${qs}` : ""}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    // Export Admin Dashboard Detail (Phase 6)
    exportAdminDashboardDetail: (params?: { tahun_masuk?: string }): Promise<Blob> => {
      const headers = config({ accept: "*/*", contentType: "none" });
      const queryParams = new URLSearchParams();
      if (params?.tahun_masuk) queryParams.append("tahun_masuk", params.tahun_masuk);
      const qs = queryParams.toString();
      return fetch(`${baseUrl}/admin/export/dashboard/detail${qs ? `?${qs}` : ""}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },
  };
};

export default Dashboard;
