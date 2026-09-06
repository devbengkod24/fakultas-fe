/* eslint-disable @typescript-eslint/no-explicit-any */

const StatistikKelulusan = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: (options?: any) => Headers;
}) => {
  // Helper untuk membuat query string dari object filter
  const buildQueryString = (params?: Record<string, any>) => {
    if (!params) return "";
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );
    const query = new URLSearchParams(cleanParams as any).toString();
    return query ? `?${query}` : "";
  };

  return {
    // SuperFakultas
    getSuperFakultasStatistikKelulusan: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/super-fakultas/statistik-kelulusan${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        
        if (result.success && result.data) {
          let normalizedData = result.data;
          
          // Jika paginated (ada result.data.data)
          if (result.data.data) {
            normalizedData = result.data.data.map((item: any) => ({
              ...item,
              // Normalisasi field yang mungkin berbeda antara API dan Component
              ipk_dibawah_2: item.ipk_dibawah_2 ?? item.ipk_kurang_dari_2,
              nilai_d_lebih_dari_5_persen: item.nilai_d_lebih_dari_5_persen ?? item.nilai_d_melebihi_batas,
              ada_nilai_e: item.ada_nilai_e ?? item.nilai_e,
              tidak_eligible: item.tidak_eligible ?? item.noneligible,
              ipk_rata_rata: item.ipk_rata_rata ?? item.ipk_rata2,
              prodi: item.prodi ?? {
                id: item.prodi_id,
                kode_prodi: item.kode_prodi,
                nama_prodi: item.nama_prodi
              }
            }));
            return { ...result, data: { ...result.data, data: normalizedData } };
          } else if (Array.isArray(result.data)) {
            // Jika array langsung
             normalizedData = result.data.map((item: any) => ({
              ...item,
              ipk_dibawah_2: item.ipk_dibawah_2 ?? item.ipk_kurang_dari_2,
              nilai_d_lebih_dari_5_persen: item.nilai_d_lebih_dari_5_persen ?? item.nilai_d_melebihi_batas,
              ada_nilai_e: item.ada_nilai_e ?? item.nilai_e,
              tidak_eligible: item.tidak_eligible ?? item.noneligible,
              ipk_rata_rata: item.ipk_rata_rata ?? item.ipk_rata2,
            }));
          }
          
          return { ...result, data: normalizedData };
        }
        return result;
      });
    },

    getSuperFakultasMahasiswaList: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/super-fakultas/mahasiswa/list${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
    },

    getSuperFakultasMahasiswaByStatus: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/super-fakultas/mahasiswa/by-status${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
    },

    getSuperFakultasNilaiDetail: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/super-fakultas/mahasiswa/nilai-detail${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
    },

    exportSuperFakultasStatistikKelulusan: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/super-fakultas/export/statistik-kelulusan${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportSuperFakultasMahasiswaList: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/super-fakultas/export/mahasiswa-list${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    // Admin
    getAdminStatistikKelulusan: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/admin/statistik-kelulusan${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        
        if (result.success && result.data && result.data.detail_per_tahun) {
          result.data.detail_per_tahun = result.data.detail_per_tahun.map((item: any) => ({
            ...item,
            ipk_dibawah_2: item.ipk_dibawah_2 ?? item.ipk_kurang_dari_2,
            nilai_d_lebih_dari_5_persen: item.nilai_d_lebih_dari_5_persen ?? item.nilai_d_melebihi_batas,
            ada_nilai_e: item.ada_nilai_e ?? item.nilai_e,
            tidak_eligible: item.tidak_eligible ?? item.noneligible,
            ipk_rata_rata: item.ipk_rata_rata ?? item.ipk_rata2,
          }));
        }
        
        return result;
      });
    },

    getAdminMahasiswaList: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/admin/mahasiswa/by-status${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
    },

    getAdminMahasiswaByStatus: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/admin/mahasiswa/by-status${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
    },

    getAdminNilaiDetail: (params?: any) => {
      const headers = config();
      return fetch(`${baseUrl}/admin/mahasiswa/nilai-detail${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
    },

    exportAdminStatistikKelulusan: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/admin/export/statistik-kelulusan${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportAdminMahasiswaList: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/admin/export/mahasiswa-list${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportAdminMahasiswaByStatus: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/admin/export/mahasiswa-list${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    // ===== Phase 6: Missing Exports =====

    exportSuperFakultasNilaiDetail: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/super-fakultas/export/nilai-detail${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportAdminNilaiDetail: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/admin/export/nilai-detail${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportSuperFakultasNilaiSummary: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/super-fakultas/export/nilai-summary${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportSuperFakultasMahasiswaByStatus: (params?: any) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}/super-fakultas/export/mahasiswa-list${buildQueryString(params)}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },

    exportSuperFakultasDetailAngkatan: (tahunMasuk: string, params?: { prodi_id?: string }) => {
      const headers = config({ accept: "*/*", contentType: "none" });
      const queryParams = new URLSearchParams();
      queryParams.append("tahun_masuk", tahunMasuk);
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      return fetch(`${baseUrl}/super-fakultas/export/detail-angkatan?${queryParams.toString()}`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },
  };
};

export default StatistikKelulusan;
