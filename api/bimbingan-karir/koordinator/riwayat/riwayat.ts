/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const Riwayat = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const riwayat = "/bk/riwayat";

    return {
      getAllRiwayat: (prodiId: number | null, page: any, limit: any, search: any, periode_id?: any) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${riwayat}?periode_id=${periode_id}&page=${page}&limit=${limit}&search=${search}`, prodiId),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all riwayat: ${error.message}`);
          });
      },
      getExportRiwayat: (periode_id: number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${riwayat}/export?periode_id=${periode_id}`),
          requestConfig
        )
          .then((response) => response.blob())
          .catch((error) => {
            throw new Error(`Error export riwayat: ${error.message}`);
          });
      },
    };
};

export default Riwayat;