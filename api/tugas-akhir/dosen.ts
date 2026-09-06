/* eslint-disable @typescript-eslint/no-explicit-any */
const Dosen = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const dosen = "/dosen";

  return {
    getAll: (
      page: number,
      limit: number,
      search: string,
      filter_kuota: string,
      bidang_kajian: string,
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/koor-ta/dosen?page=${page}&limit=${limit}&search=${search}&filter_kuota=${filter_kuota}&bidang_kajian=${bidang_kajian}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all dosen: ${error.message}`);
        });
    },

    getById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}${dosen}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching dosen by ID: ${error.message}`);
        });
    },

    getMahasiswaBimbingan: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(
        `${baseUrl}${dosen}/${id}/mahasiswa-bimbingan-ta`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching dosen by ID: ${error.message}`);
        });
    },

    create: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/add`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add dosen: ${error.message}`);
        });
    },

    update: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${dosen}/${id}/update`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update dosen: ${error.message}`);
        });
    },

    delete: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${dosen}/${id}/delete`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete dosen: ${error.message}`);
        });
    },

    sync: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/sync`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error sync data dosen: ${error.message}`);
        });
    },

    // plotting
    getListPlotMahasiswa: (search: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/koor-ta/dosen/plot/mahasiswa?page=1&limit=500&search=${search}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    plotMahasiswa: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/koor-ta/dosen/plot/${id}/add`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add dosen: ${error.message}`);
        });
    },

    importStats: (file: File) => {
      const headers = config();
      // Remove Content-Type so browser sets multipart boundary
      headers.delete("Content-Type");
      const formData = new FormData();
      formData.append("file", file);

      return fetch(`${baseUrl}/ta/koor-ta/dosen/import-stats`, {
        method: "POST",
        headers: headers,
        body: formData,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error import stats dosen: ${error.message}`);
        });
    },

    downloadStatsTemplate: () => {
      const headers = config();
      return fetch(`${baseUrl}/ta/koor-ta/dosen/stats-template`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Gagal mengunduh template");
          return response.blob();
        })
        .catch((error) => {
          throw new Error(`Error download stats template: ${error.message}`);
        });
    },

    toggleAktifPeriode: (dosenId: number) => {
      const headers = config();
      return fetch(`${baseUrl}/ta/koor-ta/dosen/${dosenId}/toggle-aktif`, {
        method: "POST",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error toggle aktif dosen: ${error.message}`);
        });
    },
  };
};

export default Dosen;
