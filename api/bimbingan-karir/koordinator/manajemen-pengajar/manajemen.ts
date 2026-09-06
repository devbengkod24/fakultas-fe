/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const ManajemenPengajar = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const manajemendosen = "/bk/manajemen-pengajar";

  return {
    getAllPengajar: (prodiId: number | null, page: any, limit: any, search: any) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${manajemendosen}?page=${page}&limit=${limit}&search=${search}`, prodiId),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all pengajar: ${error.message}`);
        });
    },
    getAllListDosen: (prodiId?: number | null) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${manajemendosen}/list-dosen`, prodiId),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all list dosen: ${error.message}`);
        });
    },
    getAllListPengajar: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${manajemendosen}/list-pengajar`),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all list pengajar: ${error.message}`);
        });
    },
    createPengajar: (data: any, prodiId?: number | null) => {
      const headers = config();

      if (headers.has("Content-Type")) {
        headers.delete("Content-Type");
      }

      if (data instanceof FormData) {
        data.append("prodi_id", prodiId?.toString() || localStorage.getItem("activeProdiId") || "");
      } else {
        data.prodi_id = prodiId?.toString() || localStorage.getItem("activeProdiId") || "";
      }

      const requestConfig = {
        method: "POST",
        body: data,
        headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${manajemendosen}`, prodiId),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error create pengajar: ${error.message}`);
        });
    },
    createPermission: (id: number, prodiId?: number | null) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        headers,
      };

      const url = prodiId
        ? addProdiToUrl(`${baseUrl}${manajemendosen}/${id}/give-permission`, prodiId)
        : addProdiToUrl(`${baseUrl}${manajemendosen}/${id}/give-permission`);

      return fetch(url,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error create permission: ${error.message}`);
        });
    },
    deletePengajar: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(addProdiToUrl(`${baseUrl}${manajemendosen}/${id}`), requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete pengajar: ${error.message}`);
        });
    },
  };
};

export default ManajemenPengajar;