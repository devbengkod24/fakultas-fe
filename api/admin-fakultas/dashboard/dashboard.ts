/* eslint-disable @typescript-eslint/no-explicit-any */

const DashboardService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/cms/admin-fakultas/dashboard";

  return {
    getSummary: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/summary`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching dashboard summary: ${error.message}`);
        });
    },

    getVisitorStats: (year: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/visitor-stats?year=${year}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching visitor stats: ${error.message}`);
        });
    },
  };
};

export default DashboardService;
