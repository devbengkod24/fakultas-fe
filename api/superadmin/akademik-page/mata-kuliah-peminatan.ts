/* eslint-disable @typescript-eslint/no-explicit-any */
const MataKuliahPeminatanService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const getmatakuliahpeminatan = "/cms/admin/mata-kuliah-peminatan";
  const getmatakuliahpeminatanbypeminatan = "/cms/admin/mata-kuliah/peminatan";
  const crudmatakuliahpeminatan = "/cms/admin/mata-kuliah";

  return {
    // Get mata kuliah peminatan (all or by peminatan)
    getMataKuliahPeminatanAll: (peminatanName?: string, prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const queryParams = new URLSearchParams();
      if (peminatanName) queryParams.append("peminatan", peminatanName);
      if (prodiId) queryParams.append("prodi_id", prodiId.toString());

      const url = queryParams.toString()
        ? (peminatanName 
            ? `${baseUrl}${getmatakuliahpeminatanbypeminatan}?${queryParams.toString()}`
            : `${baseUrl}${getmatakuliahpeminatan}?${queryParams.toString()}`)
        : `${baseUrl}${getmatakuliahpeminatan}`;

      return fetch(url, requestConfig)

        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error fetching mata-kuliah-peminatan: ${error.message}`
          );
        });
    },
    createMataKuliah: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${crudmatakuliahpeminatan}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in add mata-kuliah-peminatan section: ${error.message}`
          );
        });
    },
    updateMataKuliah: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${crudmatakuliahpeminatan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update mata-kuliah-peminatan section: ${error.message}`
          );
        });
    },
    deleteMataKuliah: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${crudmatakuliahpeminatan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete mata-kuliah-peminatan section: ${error.message}`
          );
        });
    },
  };
};

export default MataKuliahPeminatanService;
