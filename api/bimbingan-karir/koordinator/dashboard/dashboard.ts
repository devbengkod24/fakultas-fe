/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const DashboardBK = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const dashboard = "/bk/dashboard";

  return {
    getAllDashboard: (prodiId?: number | null) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${dashboard}`, prodiId),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all dashboard: ${error.message}`);
        });
    },
  };
};

export default DashboardBK;