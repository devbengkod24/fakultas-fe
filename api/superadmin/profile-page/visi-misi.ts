/* eslint-disable @typescript-eslint/no-explicit-any */
const VisiMisi = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const visimisi = "/cms/admin/visi-misi";

  return {
    // Visi Misi Section
    getAllVisiMisi: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${visimisi}`;
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

      return fetch(`${baseUrl}${visimisi}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add visimisi section: ${error.message}`);
        });
    },
    updateVisiMisi: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${visimisi}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update visimisi section: ${error.message}`);
        });
    },
    deleteVisiMisi: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${visimisi}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete visimisi section: ${error.message}`);
        });
    },
  };
};

export default VisiMisi;
