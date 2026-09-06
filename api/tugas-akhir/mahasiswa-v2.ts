/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL, API_URL_V2 } from "@/lib/constant";

const MahasiswaV2 = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const mahasiswa = "/mahasiswa";

  return {
    getAll: (
      page: number,
      limit: number,
      search: string,
      type: string,
      status?: string,
      periode_id?: string,
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = new URL(`${API_URL_V2}/ta/koor/mahasiswa/all`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("search", search);
      url.searchParams.set("type", type);
      if (status) url.searchParams.set("status", status);
      if (periode_id) url.searchParams.set("periode_id", periode_id);

      return fetch(url.toString(), requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    // Get All V2 ini sudah filter mahasiswa yang lulus saja (Yang Sidang Tugas Akhir 2 nya Accepted)
    getAllV2: (
      page: number,
      limit: number,
      search: string,
      type: string,
      sort_by?: string,
      sort_order?: "asc" | "desc",
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = new URL(`${baseUrl}/ta/koor-ta/mahasiswa`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("search", search);
      url.searchParams.set("type", type);

      if (sort_by) url.searchParams.set("sort_by", sort_by);
      if (sort_order) url.searchParams.set("sort_order", sort_order);

      return fetch(url.toString(), requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    getById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}${mahasiswa}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching mahasiswa by ID: ${error.message}`);
        });
    },

    create: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/add`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add mahasiswa: ${error.message}`);
        });
    },

    update: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${mahasiswa}/${id}/edit`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update mahasiswa: ${error.message}`);
        });
    },

    delete: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${mahasiswa}/${id}/delete`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete mahasiswa: ${error.message}`);
        });
    },

    sync: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/koor-ta/mahasiswa/sync`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error sync data mahasiswa: ${error.message}`);
        });
    },
    syncYudisium: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/koor-ta/mahasiswa/sync-yusidium`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error sync data mahasiswa yudisium: ${error.message}`,
          );
        });
    },

    export: (search: string, type: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = new URL(`${baseUrl}/ta/koor-ta/mahasiswa/export`);
      url.searchParams.set("search", search);
      url.searchParams.set("type", type);

      return fetch(url.toString(), requestConfig)
        .then((response) => {
          if (!response.ok) throw new Error("Gagal mengekspor data");
          return response.blob();
        })
        .catch((error) => {
          throw new Error(`Error exporting mahasiswa: ${error.message}`);
        });
    },

    updateDospem: (data: {
      mahasiswa_id: (string | number)[];
      dosen_id: string | number;
    }) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(
        `${API_URL}/ta/koor-ta/dosen/plot/${data.dosen_id}/add`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error updating dospem: ${error.message}`);
        });
    },

    updateDospemById: (mahasiswaId: number, dosenId: number) => {
      const headers = config();
      return fetch(
        `${baseUrl}/ta/koor-ta/mahasiswa/${mahasiswaId}/update-dospem`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ dosen_id: dosenId }),
        },
      )
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error updating dospem: ${e.message}`);
        });
    },

    getRiwayatDospem: (mahasiswaId: number) => {
      const headers = config();
      return fetch(
        `${baseUrl}/ta/koor-ta/mahasiswa/${mahasiswaId}/riwayat-dospem`,
        { method: "GET", headers },
      )
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error fetching riwayat dospem: ${e.message}`);
        });
    },
  };
};

export default MahasiswaV2;
