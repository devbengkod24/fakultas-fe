/* eslint-disable @typescript-eslint/no-explicit-any */
const Pengenalan = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const endpoint = "/pengenalan";

  return {
    // Pengenalan Section
    getAllPengenalan: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${cleanBaseUrl}${endpoint}`;
      if (prodiId) {
        url += `?prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all pengenalan section: ${error.message}`);
        });
    },
    createPengenalan: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add pengenalan section: ${error.message}`);
        });
    },
    updatePengenalan: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify({
          ...data,
          _method: "PUT"
        }),
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update pengenalan section: ${error.message}`
          );
        });
    },
    deletePengenalan: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete pengenalan section: ${error.message}`
          );
        });
    },
  };
};

export default Pengenalan;
