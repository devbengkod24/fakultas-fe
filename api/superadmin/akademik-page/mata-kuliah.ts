/* eslint-disable @typescript-eslint/no-explicit-any */
const MataKuliahService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const matakuliah = "/cms/admin/mata-kuliah";

  return {
    getMataKuliahAll: (semester?: string, prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const queryParams = new URLSearchParams();
      if (semester) queryParams.append("semester", semester);
      if (prodiId) queryParams.append("prodi_id", prodiId.toString());

      const url = queryParams.toString()
        ? `${baseUrl}${matakuliah}?${queryParams.toString()}`
        : `${baseUrl}${matakuliah}`;

      return fetch(url, requestConfig)

        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching mata-kuliah: ${error.message}`);
        });
    },
    createMataKuliah: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${matakuliah}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add mata-kuliah section: ${error.message}`);
        });
    },
    updateMataKuliah: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${matakuliah}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update mata-kuliah section: ${error.message}`
          );
        });
    },
    deleteMataKuliah: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${matakuliah}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete mata-kuliah section: ${error.message}`
          );
        });
    },
  };
};

export default MataKuliahService;
