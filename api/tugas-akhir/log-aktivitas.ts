const LogAktivitas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const activity = "/ta/koor-ta/activity";
  const activityDosen = "/ta/dosen/activity";

  return {
    getAll: (page: number, limit: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${activity}/all?page=${page}&limit=${limit}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all log: ${error.message}`);
        });
    },
    getAllDosen: (page: number, limit: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${activity}/dosen?page=${page}&limit=${limit}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all log: ${error.message}`);
        });
    },
    getAllMahasiswa: (page: number, limit: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${activity}/mahasiswa?page=${page}&limit=${limit}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all log: ${error.message}`);
        });
    },
    getMahasiswaByDosen: (page: number, limit: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${activityDosen}/mahasiswa?page=${page}&limit=${limit}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get log mahasiswa: ${error.message}`);
        });
    },
  };
};

export default LogAktivitas;
