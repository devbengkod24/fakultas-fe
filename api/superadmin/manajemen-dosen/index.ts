/* eslint-disable @typescript-eslint/no-explicit-any */
const ManajemenDosenService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/master/super-fakultas/assign-dosen";

  return {
    getDosenAll: (page: any, limit: any, search?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const params = new URLSearchParams();
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));
      if (search) params.append("search", search);

      const queryString = params.toString();
      const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching manajemen-dosen: ${error.message}`);
        });
    },
    getDosenById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error showing manajemen-dosen: ${error.message}`);
        });
    },
    createDosen: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}/master/super-fakultas/dosen`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in add manajemen-dosen section: ${error.message}`,
          );
        });
    },
    updateDosen: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update manajemen-dosen section: ${error.message}`,
          );
        });
    },
    deleteDosen: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete manajemen-dosen section: ${error.message}`,
          );
        });
    },
  };
};

export default ManajemenDosenService;
