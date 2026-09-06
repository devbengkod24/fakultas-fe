/* eslint-disable @typescript-eslint/no-explicit-any */
const Pengertian = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const pengertian = "/cms/admin/pengertian";

  return {
    // Pengertian Section
    getAllPengertian: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${pengertian}`;
      if (prodiId) {
        url += `?prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)

        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all pengertian section: ${error.message}`);
        });
    },
    createPengertian: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${pengertian}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add pengertian section: ${error.message}`);
        });
    },
    updatePengertian: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${pengertian}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update pengertian section: ${error.message}`
          );
        });
    },
    deletePengertian: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${pengertian}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete pengertian section: ${error.message}`
          );
        });
    },
  };
};

export default Pengertian;
