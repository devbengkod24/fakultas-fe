/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const DaftarMhs = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const daftarmhs = "/bk/daftar-mahasiswa";

  return {
    getAllDaftarMhs: (minat: string, page: any, limit: any, search: any, prodiId?: number | null) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = addProdiToUrl(`${baseUrl}${daftarmhs}?minat=${minat}&page=${page}&limit=${limit}&search=${search}`, prodiId);
      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all daftar mahasiswa: ${error.message}`);
        });
    },

    getAllListMahasiswa: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = addProdiToUrl(`${baseUrl}${daftarmhs}/list-mahasiswa`);
      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get list mahasiswa: ${error.message}`);
        });
    },

    getExportDaftarMhs: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = addProdiToUrl(`${baseUrl}${daftarmhs}/export`);
      return fetch(url, requestConfig)
        .then((response) => response.blob())
        .catch((error) => {
          throw new Error(`Error export daftar mahasiswa: ${error.message}`);
        });
    },
    Sync: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      const url = addProdiToUrl(`${baseUrl}${daftarmhs}/sync`);
      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error sync daftar mahasiswa: ${error.message}`);
        });
    },

    updateMinatMahasiswa: (data: any, id: number) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      const url = addProdiToUrl(`${baseUrl}${daftarmhs}/minat/${id}`);
      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error update minat mahasiswa: ${error.message}`);
        });
    },
  };
};

export default DaftarMhs;