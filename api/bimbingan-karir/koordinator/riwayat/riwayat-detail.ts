/* eslint-disable @typescript-eslint/no-explicit-any */
const RiwayatDetail = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const riwayatdetail = "/bk/riwayat-detail";

    return {
      getAllRiwayatDetail: (id: number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };
  
        return fetch(`${baseUrl}${riwayatdetail}/${id}`,
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all riwayat detail: ${error.message}`);
          });
      },
    };
};

export default RiwayatDetail;