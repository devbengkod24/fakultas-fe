/* eslint-disable @typescript-eslint/no-explicit-any */
const Pengumuman = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/kp/koor-kp/pengumuman";

  return {
    getPengumumanList: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching pengumuman: ${error.message}`);
        });
    },

    getPengumumanById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching pengumuman by ID: ${error.message}`);
        });
    },

    createPengumuman: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add pengumuman: ${error.message}`);
        });
    },

    updatePengumuman: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update pengumuman: ${error.message}`);
        });
    },

    deletePengumuman: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete pengumuman: ${error.message}`);
        });
    },
  };
};

export default Pengumuman;