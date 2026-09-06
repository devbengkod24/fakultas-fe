const Dashboard = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  return {
    getTaChart: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/statistic-krs`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all logbook: ${error.message}`);
        });
    },
  };
};

export default Dashboard;
