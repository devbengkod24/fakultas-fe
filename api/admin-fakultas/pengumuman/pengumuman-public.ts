/* eslint-disable @typescript-eslint/no-explicit-any */
const PengumumanPublic = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const publicEndpoint = "/cms/public/pengumuman";

  return {
    getPublicPengumumanList: (
      type: string = "all",
      status: string = "published",
      limit: number = 10,
      sortOrder: string = "desc",
      prodiValue?: string | number,
      search?: string
    ) => {
      const headers = config();
      const queryParams: any = {
        type,
        status,
        limit: limit.toString(),
        sort_order: sortOrder,
      };

      if (prodiValue) {
        queryParams.prodi = prodiValue;
        queryParams.prodi_id = prodiValue;
      }

      if (search) {
        queryParams.search = search;
      }

      const params = new URLSearchParams(queryParams);

      return fetch(`${baseUrl}${publicEndpoint}?${params.toString()}`, {
        method: "GET",
        headers,
      }).then((response) => response.json());
    },

    getPublicPengumumanById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${publicEndpoint}/${id}`, {
        method: "GET",
        headers,
      }).then((response) => response.json());
    },

    getPublicPopupPengumumans: () => {
      const headers = config();
      return fetch(`${baseUrl}${publicEndpoint}/pop-up`, {
        method: "GET",
        headers,
      }).then((response) => response.json());
    },
  };
};

export default PengumumanPublic;