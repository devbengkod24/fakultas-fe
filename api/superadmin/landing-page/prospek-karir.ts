/* eslint-disable @typescript-eslint/no-explicit-any */
export const ProfilLulusanService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/cms/admin/profil-lulusan";

  return {
    getAll: (page: any, limit: any, prodiId?: number) => {
      const headers = config();
      let url = `${baseUrl}${endpoint}?page=${page}&limit=${limit}`;
      if (prodiId) url += `&prodi_id=${prodiId}`;

      return fetch(url, { method: "GET", headers })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error fetching profil-lulusan: ${error.message}`) });
    },
    create: (data: any) => {
      return fetch(`${baseUrl}${endpoint}`, { method: "POST", body: JSON.stringify(data), headers: config() })
        .then((response) => response.json());
    },
    update: (id: number, data: any) => {
      return fetch(`${baseUrl}${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(data), headers: config() })
        .then((response) => response.json());
    },
    delete: (id: number) => {
      return fetch(`${baseUrl}${endpoint}/${id}`, { method: "DELETE", headers: config() })
        .then((response) => response.json());
    },
  };
};

export const ProfesiLulusanService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/cms/admin/profesi-lulusan";

  return {
    getAll: (page: any, limit: any, prodiId?: number) => {
      const headers = config();
      let url = `${baseUrl}${endpoint}?page=${page}&limit=${limit}`;
      if (prodiId) url += `&prodi_id=${prodiId}`;

      return fetch(url, { method: "GET", headers })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error fetching profesi-lulusan: ${error.message}`) });
    },
    create: (data: any) => {
      return fetch(`${baseUrl}${endpoint}`, { method: "POST", body: JSON.stringify(data), headers: config() })
        .then((response) => response.json());
    },
    update: (id: number, data: any) => {
      return fetch(`${baseUrl}${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(data), headers: config() })
        .then((response) => response.json());
    },
    delete: (id: number) => {
      return fetch(`${baseUrl}${endpoint}/${id}`, { method: "DELETE", headers: config() })
        .then((response) => response.json());
    },
  };
};
