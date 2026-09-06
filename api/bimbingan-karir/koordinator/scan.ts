/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../helpers/prodiFetcher";

const ScanHeader = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const scan = "/bk/scan-header";

    return {
        scanHeaderImportMhs: (data: FormData) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
              }

            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${scan}`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error in scan header: ${error.message}`);
            });
        },
    };
};

export default ScanHeader;