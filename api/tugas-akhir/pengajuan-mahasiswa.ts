/* eslint-disable @typescript-eslint/no-explicit-any */
const PengajuanMahasiswa = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const koor = "/ta/koor-ta/mahasiswa/pengajuan";
  const dosen = "/ta/dosen/pengajuan";
  const mahasiswa = "/ta/mahasiswa/pengajuan";

  return {
    koorGetAll: (
      type: string,
      page: number,
      limit: number,
      search: string,
      status: string,
      jalur: string,
      bidang_kajian: string,
      sort_order?: string
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${koor}/list?type=${type}&page=${page}&limit=${limit}&search=${search}&status=${status}&jalur=${jalur}&bidang_kajian=${bidang_kajian}&sort_order=${sort_order}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all pengajuan: ${error.message}`);
        });
    },

    dosenGetAll: (
      type: string,
      page: number,
      limit: number,
      search: string,
      status: string,
      jalur: string,
      bidang_kajian: string,
      sort_order?: string
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${dosen}?type=${type}&page=${page}&limit=${limit}&search=${search}&status=${status}&jalur=${jalur}&bidang_kajian=${bidang_kajian}&sort_order=${sort_order}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all pengajuan: ${error.message}`);
        });
    },

    koorUpdateStatus: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${koor}/update-status/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update pengajuan: ${error.message}`);
        });
    },

    dosenUpdateStatus: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${dosen}/update-status/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update pengajuan: ${error.message}`);
        });
    },

    // mahasiswa
    getDosenPeriode: (
      page: number,
      limit: number,
      search: string,
      filter_kuota: string,
      bidang_kajian: string
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${mahasiswa}/dosen-periode?page=${page}&limit=${limit}&search=${search}&filter_kuota=${filter_kuota}&bidang_kajian=${bidang_kajian}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all dosen: ${error.message}`);
        });
    },

    pengajuanTA: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${mahasiswa}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update pengajuan: ${error.message}`);
        });
    },

    getPengajuanStatus: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/status-web`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all dosen: ${error.message}`);
        });
    },

    cancelPengajuan: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "POST", // Although the action is cancel, we defined it as POST in Laravel
        headers: headers,
      };
      return fetch(`${baseUrl}${mahasiswa}/${id}/cancel`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in cancel pengajuan: ${error.message}`);
        });
    },

    getHistoryPengajuan: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/histori`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all dosen: ${error.message}`);
        });
    },

    inputPengajuanByPlot: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(
        `${baseUrl}${mahasiswa}/input-pengajuan-by-plot`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in input pengajuan by plot: ${error.message}`);
        });
    },
  };
};

export default PengajuanMahasiswa;
