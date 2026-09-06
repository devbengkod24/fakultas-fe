/* eslint-disable @typescript-eslint/no-explicit-any */
const SummaryStatisticServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const summary = "/stats/summary";

  return {
    // Pengertian Section
    getAllSummaryStatistic: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${summary}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get summary statistic section: ${error.message}`
          );
        });
    },
  };
};

export default SummaryStatisticServices;
