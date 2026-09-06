/* eslint-disable @typescript-eslint/no-explicit-any */
const Periode = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const periode = "/periode";

  return {
    getAllPeriode: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${periode}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all periode: ${error.message}`);
        });
    },

    syncPeriode: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${periode}/sync`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error sync periode: ${error.message}`);
        });
    },

    update: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${periode}/${id}/update`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add dosen: ${error.message}`);
        });
    },

    changeStatus: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        headers: headers,
      };

      return fetch(`${baseUrl}${periode}/${id}/change-status`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error change status periode: ${error.message}`);
        });
    },
  };
};

export default Periode;
