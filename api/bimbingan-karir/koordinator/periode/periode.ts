/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const Periode = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const periode = "/periode";

  return {
    getAllPeriode: (prodiId?: number | null) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${periode}`, prodiId), requestConfig)
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

      return fetch(addProdiToUrl(`${baseUrl}${periode}/sync`), requestConfig)
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

      return fetch(addProdiToUrl(`${baseUrl}${periode}/${id}/update`), requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update periode: ${error.message}`);
        });
    },

    changeStatus: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${periode}/${id}/change-status`), requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error change status periode: ${error.message}`);
        });
    },
  };
};

export default Periode;
