/* eslint-disable @typescript-eslint/no-explicit-any */
const VerifikasiSertifikatServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const verifikasiSertifikat = "/bk/cek-sertifikat";

  return {
    // Pengertian Section
    createVerifikasiSertifikat: (data: FormData) => {
      const headers = config();
      if (headers.has("Content-Type")) {
          headers.delete("Content-Type");
      }
      const requestConfig = {
        method: "POST",
        body: data,
        headers,
      };
      return fetch(`${baseUrl}${verifikasiSertifikat}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all verifikasi sertifikat services section: ${error.message}`
          );
        });
    },
  };
};

export default VerifikasiSertifikatServices;
