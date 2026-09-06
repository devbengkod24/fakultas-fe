/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ProdiDataGagal,
  RataIpsData,
  TabelCapaianProdi,
  TabelCapaianDetail,
  MatakuliahGagal,
} from "@/types/ews/capaian-mahasiswa/capaian-mahasiswa";

const CapaianMahasiswa = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: (options?: any) => Headers;
}) => {
  const buildQueryString = (params?: Record<string, any>) => {
    if (!params) return "";
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );
    const query = new URLSearchParams(cleanParams as any).toString();
    return query ? `?${query}` : "";
  };

  const handleResponse = (res: Response) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  return {
    // SuperFakultas
    getSuperFakultasTopMatakuliahGagal: (): Promise<{
      success: boolean;
      data: { data_per_prodi: ProdiDataGagal[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/top-matakuliah-gagal`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getSuperFakultasRataRataIps: (): Promise<{
      success: boolean;
      data: { data_per_prodi: RataIpsData[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/rata-rata-ips`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getSuperFakultasTabelCapaian: (): Promise<{
      success: boolean;
      data: { data_per_prodi: TabelCapaianProdi[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/tabel-capaian`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getSuperFakultasTabelCapaianDetail: (): Promise<{
      success: boolean;
      data: { data: TabelCapaianDetail[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/tabel-capaian/detail`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getSuperFakultasListMatakuliahGagal: (params: {
      prodi_id: string;
    }): Promise<{
      success: boolean;
      data: { data_per_prodi: { prodi: any; matakuliah: MatakuliahGagal[] }[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/list-matakuliah${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getSuperFakultasListMahasiswaGagal: (params: {
      matakuliah_id: string;
      prodi_id?: string;
      tahun_masuk?: string;
    }): Promise<{
      success: boolean;
      data: { total_data: number; data: any[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/mahasiswa-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    // Admin
    getAdminTopMatakuliahGagal: (params?: {
      tahun_masuk?: string;
    }): Promise<{
      success: boolean;
      data: {
        data_per_prodi: {
          prodi: any;
          total_mahasiswa_gagal: number;
          top_matakuliah_gagal: MatakuliahGagal[];
        }[];
      };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/top-matakuliah-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getAdminRataRataIps: (): Promise<{
      success: boolean;
      data: {
        total_prodi: number;
        data_per_prodi: RataIpsData[];
      };
    }> => {
      const headers = config();
      return fetch(`${baseUrl}/admin/capaian-mahasiswa/rata-rata-ips`, {
        method: "GET",
        headers,
      }).then(handleResponse);
    },

    getAdminTabelCapaian: (): Promise<{
      success: boolean;
      data: { data: any[] };
    }> => {
      const headers = config();
      return fetch(`${baseUrl}/admin/capaian-mahasiswa/tabel-capaian`, {
        method: "GET",
        headers,
      }).then(handleResponse);
    },

    getAdminTabelCapaianDetail: (): Promise<{
      success: boolean;
      data: { data: any[] };
    }> => {
      const headers = config();
      return fetch(`${baseUrl}/admin/capaian-mahasiswa/tabel-capaian/detail`, {
        method: "GET",
        headers,
      }).then(handleResponse);
    },

    getAdminListMatakuliahGagal: (params?: {
      tahun_masuk?: string;
    }): Promise<{
      success: boolean;
      data: {
        total_prodi: number;
        data_per_prodi: {
          prodi: any;
          tahun_angkatan?: number;
          matakuliah: MatakuliahGagal[];
        }[];
      };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/list-matakuliah${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    getAdminListMahasiswaGagal: (params: {
      matakuliah_id: string;
      tahun_masuk?: string;
    }): Promise<{
      success: boolean;
      data: { total_data: number; data: any[] };
    }> => {
      const headers = config();
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/mahasiswa-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(handleResponse);
    },

    // ===== Export Methods (Phase 6) =====

    // SuperFakultas Capaian Mahasiswa Exports
    exportSuperFakultasTopMatakuliahGagal: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/export/top-matakuliah-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportSuperFakultasRataRataIps: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/export/rata-rata-ips${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportSuperFakultasTabelCapaian: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/export/tabel-capaian${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportSuperFakultasTabelCapaianDetail: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/export/tabel-capaian/detail${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportSuperFakultasListMatakuliah: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/export/list-matakuliah${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportSuperFakulMahasiswaGagal: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/super-fakultas/capaian-mahasiswa/export/mahasiswa-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    // Admin Capaian Mahasiswa Exports
    exportAdminTopMatakuliahGagal: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/export/top-matakuliah-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportAdminRataRataIps: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/export/rata-rata-ips${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportAdminTabelCapaian: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/export/tabel-capaian${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportAdminTabelCapaianDetail: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/export/tabel-capaian/detail${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportAdminListMatakuliah: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/export/list-matakuliah${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },

    exportAdminMahasiswaGagal: (params?: any): Promise<Blob> => {
      const headers = config({ accept: "*/*" });
      return fetch(
        `${baseUrl}/admin/capaian-mahasiswa/export/mahasiswa-gagal${buildQueryString(params)}`,
        {
          method: "GET",
          headers,
        }
      ).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try {
            const json = JSON.parse(text);
            errMsg = json?.message || json?.error || errMsg;
          } catch {
            /* ignore parse fail */
          }
          throw new Error(errMsg);
        }
        return res.blob();
      });
    },
  };
};

export default CapaianMahasiswa;
