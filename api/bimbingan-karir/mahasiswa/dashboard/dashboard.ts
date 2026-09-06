/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const DashboardMhsBK = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const dashboard = "/bk/dashboard-mahasiswa";

  return {
    getAllDashboard: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = addProdiToUrl(`${baseUrl}${dashboard}`);
      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all dashboard: ${error.message}`);
        });
    },
  };
};

export default DashboardMhsBK;