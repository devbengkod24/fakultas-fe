/* eslint-disable @typescript-eslint/no-explicit-any */
const ImportMhs = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const importmhs = "/bk/import-mahasiswa";

  return {
    createImportMhs: (data: FormData) => {
      const headers = config();

      if (headers.has("Content-Type")) {
        headers.delete("Content-Type");
      }

      const requestConfig = {
        method: "POST",
        body: data,
        headers,
      };

      return fetch(`${baseUrl}${importmhs}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in import mahasiswa: ${error.message}`);
        });
    },
  };
};

export default ImportMhs;