import { configureHeaders } from "@/api/index";

const ProdiConfigService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const prodiconfig = "/cms/admin/prodi-config";

  return {
    getByKode: (kode: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${prodiconfig}/${kode}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching prodi config: ${error.message}`);
        });
    },

    getAll: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${prodiconfig}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching all prodi: ${error.message}`);
        });
    },
  };
};

export default ProdiConfigService;
