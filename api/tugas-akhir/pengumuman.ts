/* eslint-disable @typescript-eslint/no-explicit-any */
const TAPengumuman = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/ta/koor-ta/pengumuman";

  return {
    getAll: (page: number = 1, limit: number = 10, search: string = "") => {
      const headers = config();
      const params = new URLSearchParams({
        type: "ta",
        page: String(page),
        limit: String(limit),
        search,
      });
      return fetch(`${baseUrl}${endpoint}?${params}`, {
        method: "GET",
        headers,
      })
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error fetching pengumuman TA: ${e.message}`);
        });
    },

    getById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}`, { method: "GET", headers })
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error fetching pengumuman by ID: ${e.message}`);
        });
    },

    create: (data: any) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...data, type: "ta" }),
      })
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error creating pengumuman: ${e.message}`);
        });
    },

    update: (id: number, data: any) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...data, type: "ta" }),
      })
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error updating pengumuman: ${e.message}`);
        });
    },

    delete: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}`, { method: "DELETE", headers })
        .then((r) => r.json())
        .catch((e) => {
          throw new Error(`Error deleting pengumuman: ${e.message}`);
        });
    },
  };
};

export default TAPengumuman;
