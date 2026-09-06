/* eslint-disable @typescript-eslint/no-explicit-any */

const AdminDashboardService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/cms/admin/dashboard";

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
          throw new Error(`Error fetching admin dashboard summary: ${error.message}`);
        });
    },
  };
};

export default AdminDashboardService;
