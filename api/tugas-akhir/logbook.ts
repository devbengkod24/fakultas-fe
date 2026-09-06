/* eslint-disable @typescript-eslint/no-explicit-any */

const Logbook = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const koordinator = "/ta/koor-ta/rekap-logbook";
  const koor = "/ta/koor-ta/mahasiswa/logbook";
  const mahasiswa = "/ta/mahasiswa/logbook";
  const dosen = "/ta/dosen/logbook";

  return {
    getAllRekap: (page: number, limit: number, search: string) => {
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

    getSiapSidang: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koordinator}/total-siap-sidang`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all mahasiswa siap sidang: ${error.message}`
          );
        });
    },

    // mahasiswa
    getLogbookEntries: (page: number, limit: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${mahasiswa}?page=${page}&limit=${limit}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    getDetailMahasiswa: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/detail/mhs`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get detail mahasiswa: ${error.message}`);
        });
    },

    createLogbook: (data: any) => {
      const headers = config();
      headers.append("Content-Type", "application/json");

      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(`${baseUrl}${mahasiswa}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error creating logbook: ${error.message}`);
        });
    },

    updateLogbook: (data: any, id: number) => {
      const headers = config();
      headers.append("Content-Type", "application/json");

      const requestConfig = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(`${baseUrl}${mahasiswa}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error creating logbook: ${error.message}`);
        });
    },

    // folder
    getFolder: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/folder`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all mahasiswa siap sidang: ${error.message}`
          );
        });
    },

    updateFolder: (data: any) => {
      const headers = config();
      headers.append("Content-Type", "application/json");

      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(`${baseUrl}${mahasiswa}/folder`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error creating logbook: ${error.message}`);
        });
    },

    // dosen
    getLogbookList: (
      page: number,
      limit: number,
      search: string,
      status_tugas_akhir?: string
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${dosen}?page=${page}&limit=${limit}&search=${search}&status_tugas_akhir=${status_tugas_akhir}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    getDetailMahasiswaDosen: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/mahasiswa/detail/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get detail mahasiswa: ${error.message}`);
        });
    },

    getLogbookMahasiswaById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/mahasiswa/${id}?view=all`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get detail mahasiswa: ${error.message}`);
        });
    },

    updateStatusLogbook: (logbookId: number, data: any) => {
      const headers = config();
      headers.append("Content-Type", "application/json");

      const requestConfig = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(
        `${baseUrl}${dosen}/update-status/${logbookId}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error updating logbook status: ${error.message}`);
        });
    },

    // koor

    // Get List Mahasiswa By Dosen ID
    getLogbookListKoor: (
      id: number,
      page: number,
      limit: number,
      search: string,
      status_tugas_akhir?: string
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${koor}/mhs-by-dosen/${id}?page=${page}&limit=${limit}&search=${search}&status_tugas_akhir=${status_tugas_akhir}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    getDetailMahasiswaKoor: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/koor-ta/mahasiswa/logbook/mhs-detail/${id}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get detail mahasiswa: ${error.message}`);
        });
    },

    // Get Logbook By Mahasiswa ID
    getLogbookMahasiswaByIdKoor: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/koor-ta/mahasiswa/logbook/mhs-by-dosen/detail/${id}?view=all`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get detail mahasiswa: ${error.message}`);
        });
    },

    // Update Status Logbook By Koor
    updateStatusLogbookKoor: (logbookId: number, data: any) => {
      const headers = config();
      headers.append("Content-Type", "application/json");

      const requestConfig = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(
        `${baseUrl}${koor}/mhs-by-dosen/update/${logbookId}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error updating logbook status: ${error.message}`);
        });
    },
  };
};

export default Logbook;
