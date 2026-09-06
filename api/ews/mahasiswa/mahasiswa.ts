/* eslint-disable @typescript-eslint/no-explicit-any */

const Mahasiswa = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: (options?: any) => Headers;
}) => {
  const base = "/mahasiswa";

  return {
    getProfile: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${base}/profile`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get mahasiswa profile: ${error.message}`);
        });
    },

    exportProfile: (): Promise<Blob> => {
      const headers = config({ accept: "*/*", contentType: "none" });
      return fetch(`${baseUrl}${base}/export/profile`, {
        method: "GET", headers,
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });
    },
  };
};

export default Mahasiswa;
