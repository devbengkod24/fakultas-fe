/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const PersentaseRekap = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const persentaserekap = "/bk/persentase";

    return {
      getAllPersentaseRekap: () => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${persentaserekap}`),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all persentase rekap nilai: ${error.message}`);
          });
      },


      createPersentaseRekap: (data: any) => {
        const headers = config();

        const requestConfig = {
          method: "POST",
          body: JSON.stringify(data),
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${persentaserekap}`),
            requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error in add persentase rekap nilai: ${error.message}`);
          });
      },
    };
};

export default PersentaseRekap;