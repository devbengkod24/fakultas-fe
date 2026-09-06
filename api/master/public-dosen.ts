/* eslint-disable @typescript-eslint/no-explicit-any */
const PublicDosenService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/master/public/dosen";

  return {
    getById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching public dosen: ${error.message}`);
        });
    },
  };
};

export default PublicDosenService;