/* eslint-disable @typescript-eslint/no-explicit-any */
const KuotaDosen = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const koordinator = "/ta/koor-ta/dosen/kuota";

  return {
    getOverview: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koordinator}/jumlah-mahasiswa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get jumlah mahasiswa: ${error.message}`);
        });
    },

    getList: (page: number, limit: number, search: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${koordinator}?page=${page}&limit=${limit}&search=${search}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },
    updateKuota: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${koordinator}/${id}/update`, requestConfig)
        .then((response) => response.json().then((res) => {
          if (res.success === false) {
            throw new Error(res.message || "Gagal memperbarui kuota");
          }
          return res;
        }))
        .catch((error) => {
          throw new Error(`Error in update kuota dosen: ${error.message}`);
        });
    },
    getAlokasi: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koordinator}/alokasi`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get jumlah mahasiswa: ${error.message}`);
        });
    },
    updateAlokasi: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${koordinator}/alokasi/update`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update alokasi kuota: ${error.message}`);
        });
    },
    getMahasiswaByDosen: (dosenId: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koordinator}/${dosenId}/mahasiswa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get mahasiswa by dosen: ${error.message}`);
        });
    },
  };
};

export default KuotaDosen;
