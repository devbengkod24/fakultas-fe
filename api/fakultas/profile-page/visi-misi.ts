/* eslint-disable @typescript-eslint/no-explicit-any */
const VisiMisi = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const endpoint = "/visi-misi";

  return {
    // Visi Misi Section
    getAllVisiMisi: (prodiId?: number) => {
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
          throw new Error(`Error get all visi misi section: ${error.message}`);
        });
    },
    createVisiMisi: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add visi misi section: ${error.message}`);
        });
    },
    updateVisiMisi: (id: number, data: any) => {
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
            `Error in update visi misi section: ${error.message}`
          );
        });
    },
    deleteVisiMisi: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete visi misi section: ${error.message}`
          );
        });
    },
  };
};

export default VisiMisi;
