/* eslint-disable @typescript-eslint/no-explicit-any */
const Peminatan = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const getpeminatanall = "/cms/admin/peminatan";
  const crudpeminatan = "/cms/admin/mata-kuliah-peminatan";

  return {
    // Pengertian Section
    getPeminatan: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const queryParams = new URLSearchParams();
      if (prodiId) queryParams.append("prodi_id", prodiId.toString());

      const url = queryParams.toString()
        ? `${baseUrl}${getpeminatanall}?${queryParams.toString()}`
        : `${baseUrl}${getpeminatanall}`;

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all peminatan section: ${error.message}`);
        });
    },
    createPeminatan: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${crudpeminatan}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add peminatan section: ${error.message}`);
        });
    },
    updatePeminatan: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${crudpeminatan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update peminatan section: ${error.message}`
          );
        });
    },
    deletePeminatan: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${crudpeminatan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete peminatan section: ${error.message}`
          );
        });
    },
  };
};

export default Peminatan;
