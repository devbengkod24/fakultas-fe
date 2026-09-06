const LaporanEksekutifFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/fakultas/laporan-eksekutif";

  return {
    getProdiDetail: (prodiId: number, periodeId?: number) => {
      const headers = config();
      const params = new URLSearchParams();
      if (periodeId) params.append("periode_id", periodeId.toString());

      return fetch(
        `${baseUrl}${endpoint}/prodi/${prodiId}?${params.toString()}`,
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get laporan eksekutif prodi: ${error.message}`
          );
        });
    },

    exportPdf: (prodiId: number, periodeId?: number) => {
      const headers = config();
      const params = new URLSearchParams();
      if (periodeId) params.append("periode_id", periodeId.toString());

      return fetch(
        `${baseUrl}${endpoint}/prodi/${prodiId}/export/pdf?${params.toString()}`,
        {
          method: "GET",
          headers: headers,
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      });
    },
  };
};

export default LaporanEksekutifFakultas;
