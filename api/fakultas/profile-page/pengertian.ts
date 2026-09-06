/* eslint-disable @typescript-eslint/no-explicit-any */
const Pengertian = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const endpoint = "/pengertian";

  return {
    getAllPengertian: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = `${cleanBaseUrl}${endpoint}`;

      return fetch(url, requestConfig)
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error get all pengertian: ${error.message}`);
        });
    },

    createPengertian: (data: { pengertian: string }) => {
      const headers = config();
      headers.set("Content-Type", "application/json");

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in create pengertian: ${error.message}`);
        });
    },

    updatePengertian: (id: number, data: { pengertian: string }) => {
      const headers = config();
      headers.set("Content-Type", "application/json");

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update pengertian: ${error.message}`);
        });
    },

    deletePengertian: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete pengertian: ${error.message}`);
        });
    },
  };
};

export default Pengertian;
