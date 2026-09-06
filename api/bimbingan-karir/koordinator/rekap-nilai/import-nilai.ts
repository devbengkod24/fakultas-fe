/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const ImportNilai = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const importnilai = "/bk/import-nilai";

    return {
        createImportNilai: (data: FormData) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
              }

            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${importnilai}`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error in import nilai: ${error.message}`);
            });
        },
    };
  };

  export default ImportNilai;