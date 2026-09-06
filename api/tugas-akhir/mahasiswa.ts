/* eslint-disable @typescript-eslint/no-explicit-any */
const Mahasiswa = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const mahasiswa = "/mahasiswa";

  return {
    getAll: (page: number, limit: number, search: string, type: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${mahasiswa}?page=${page}&limit=${limit}&search=${search}&type=${type}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    // Get All V2 ini sudah filter mahasiswa yang lulus saja (Yang Sidang Tugas Akhir 2 nya Accepted)
    getAllV2: (page: number, limit: number, search: string, type: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/koor-ta/mahasiswa?page=${page}&limit=${limit}&search=${search}&type=${type}`,
        requestConfig
      )
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

    import: (file: File) => {
      const headers = config();
      // Remove Content-Type to let the browser set it automatically for FormData
      const filteredHeaders = new Headers(headers);
      filteredHeaders.delete("Content-Type");

      const formData = new FormData();
      formData.append("file", file);

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: filteredHeaders,
      };

      return fetch(`${baseUrl}/ta/koor-ta/mahasiswa/import`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error import mahasiswa: ${error.message}`);
        });
    },

    importLulus: (file: File, periodeId: number) => {
      const headers = config();
      const filteredHeaders = new Headers(headers);
      filteredHeaders.delete("Content-Type");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("periode_selesai_id", periodeId.toString());

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: filteredHeaders,
      };

      return fetch(`${baseUrl}/ta/koor-ta/mahasiswa/import-lulus`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error import lulusan: ${error.message}`);
        });
    },

    downloadTemplate: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/koor-ta/mahasiswa/template`, requestConfig)
        .then((response) => {
          if (!response.ok) throw new Error("Gagal mengunduh template");
          return response.blob();
        })
        .catch((error) => {
          throw new Error(`Error download template: ${error.message}`);
        });
    },
  };
};

export default Mahasiswa;
