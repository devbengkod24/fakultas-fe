/* eslint-disable @typescript-eslint/no-explicit any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const LogAktivitas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const activity = "/bk/activity";

  return {
    getAll: (page: number, limit: number, search: string, type: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        addProdiToUrl(`${baseUrl}${activity}?page=${page}&limit=${limit}&search=${search}&type=${type}`),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all log: ${error.message}`);
        });
    },
  };
};

export default LogAktivitas;