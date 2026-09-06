/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const RekapNilai = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const rekapnilai = "/bk/rekap-nilai";

    return {
      getAllRekapNilai: (prodiId: number | null, page: any, limit: any, search: any) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${rekapnilai}?page=${page}&limit=${limit}&search=${search}`, prodiId),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all rekap nilai: ${error.message}`);
          });
      },


      getAllRekapNilaiDetail: (id: number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${rekapnilai}/${id}`),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get detail rekap nilai: ${error.message}`);
          });
      },

      getExportRekapNilai: () => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${rekapnilai}/export`),
          requestConfig
        )
          .then((response) => response.blob())
          .catch((error) => {
            throw new Error(`Error export rekap nilai: ${error.message}`);
          });
      },
    };
};

export default RekapNilai;