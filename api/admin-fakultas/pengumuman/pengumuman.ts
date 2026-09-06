/* eslint-disable @typescript-eslint/no-explicit-any */
const Pengumuman = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const pengumuman = "/pengumuman";
  const adminFakultasEndpoint = "/cms/admin-fakultas/pengumuman";

  return {
    // General Methods
    getPengumumanList: (type: any, page: any, limit: any, search: any, prodiId?: number | string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${pengumuman}?type=${type}&page=${page}&limit=${limit}&search=${search}`;
      if (prodiId) {
        url += `&prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching pengumuman: ${error.message}`);
        });
    },

    getPengumumanById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}${pengumuman}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching pengumuman by ID: ${error.message}`);
        });
    },

    createPengumuman: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${pengumuman}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add pengumuman: ${error.message}`);
        });
    },

    updatePengumuman: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${pengumuman}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update pengumuman: ${error.message}`);
        });
    },

    deletePengumuman: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${pengumuman}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete pengumuman: ${error.message}`);
        });
    },

    // Admin Fakultas Methods
    getAdminFakultasPengumumanList: (
      type: string = "all",
      status: string = "all",
      limit: number = 10,
      sortOrder: string = "desc",
      page: number = 1,
      search: string = "",
      prodiId?: string,
      isPopUp?: boolean
    ) => {
      const headers = config();
      const queryParams: any = {
        type,
        limit: limit.toString(),
        sort_order: sortOrder,
        page: page.toString(),
      };

      if (["pending", "approve", "reject", "approved", "rejected"].includes(status)) {
        queryParams.status_verified = status.replace("approved", "approve").replace("rejected", "reject");
        queryParams.status = "all";
      } else {
        queryParams.status = status;
      }

      if (search) {
        queryParams.search = search;
      }

      if (prodiId && prodiId !== "all") {
        queryParams.prodi_id = prodiId;
        queryParams.prodi = prodiId;
      }

      if (isPopUp !== undefined) {
        queryParams.is_pop_up = isPopUp.toString();
      }

      const params = new URLSearchParams(queryParams);

      return fetch(`${baseUrl}${adminFakultasEndpoint}?${params.toString()}`, {
        method: "GET",
        headers,
      }).then((response) => response.json());
    },

    getAdminFakultasPengumumanById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${adminFakultasEndpoint}/${id}`, {
        method: "GET",
        headers,
      }).then((response) => response.json());
    },

    createAdminFakultasPengumuman: (data: any) => {
      const headers = config();
      const body = { ...data };

      return fetch(`${baseUrl}${adminFakultasEndpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }).then((response) => response.json());
    },

    updateAdminFakultasPengumuman: (id: number, data: any) => {
      const headers = config();
      const body = { ...data };

      return fetch(`${baseUrl}${adminFakultasEndpoint}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      }).then((response) => response.json());
    },

    deleteAdminFakultasPengumuman: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${adminFakultasEndpoint}/${id}`, {
        method: "DELETE",
        headers,
      }).then((response) => response.json());
    },

    verifyAdminFakultasPengumuman: (id: number, statusVerified: "approve" | "reject") => {
      const headers = config();
      return fetch(`${baseUrl}${adminFakultasEndpoint}/${id}/verify`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status_verified: statusVerified }),
      }).then((response) => response.json());
    },

    assignOrRemoveAdminFakultasPopup: (id: number, statusVerified: "approve" | "reject") => {
      const headers = config();
      return fetch(`${baseUrl}${adminFakultasEndpoint}/${id}/assign-or-remove-pop-up`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status_verified: statusVerified }),
      }).then((response) => response.json());
    },

    changeStatusAdminFakultasPengumuman: (id: number, status: "archived" | "published") => {
      const headers = config();
      return fetch(`${baseUrl}${adminFakultasEndpoint}/${id}/change-status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      }).then((response) => response.json());
    },
  };
};

export default Pengumuman;