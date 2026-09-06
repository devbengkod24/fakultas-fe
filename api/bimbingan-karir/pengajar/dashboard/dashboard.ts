/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const DashboardPengajar = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const dashboard = "/bk/dashboard-pengajar";

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
            throw new Error(`Error get all dashboard pengajar: ${error.message}`);
          });
      },
    };
};

export default DashboardPengajar;