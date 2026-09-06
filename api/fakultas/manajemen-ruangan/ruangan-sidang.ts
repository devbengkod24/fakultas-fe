/* eslint-disable @typescript-eslint/no-explicit-any */
const RuanganSidang = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const base = "/fik/ruangan-sidang";

  return {
    getAll: (params?: { search?: string; limit?: number; only_active?: boolean }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.limit) qs.set("limit", String(params.limit));
      if (params?.only_active) qs.set("only_active", "1");
      return fetch(`${baseUrl}${base}?${qs}`, {
        method: "GET",
        headers: config(),
      }).then((r) => r.json());
    },

    create: (data: {
      nama_ruangan: string;
      kapasitas?: number | null;
      gedung?: string | null;
      is_active?: boolean;
      is_online?: boolean;
    }) =>
      fetch(`${baseUrl}${base}`, {
        method: "POST",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    update: (
      id: number,
      data: {
        nama_ruangan?: string;
        kapasitas?: number | null;
        gedung?: string | null;
        is_active?: boolean;
        is_online?: boolean;
      },
    ) =>
      fetch(`${baseUrl}${base}/${id}`, {
        method: "PATCH",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    delete: (id: number) =>
      fetch(`${baseUrl}${base}/${id}`, {
        method: "DELETE",
        headers: config(),
      }).then((r) => r.json()),
  };
};

export default RuanganSidang;
