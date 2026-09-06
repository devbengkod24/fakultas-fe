/* eslint-disable @typescript-eslint/no-explicit-any */
const MonitoringSidang2 = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const koor = "/ta/koor-ta/monitor-sidang/sidang-ta-2";
  const dosen = "/ta/dosen/sidang/ta2";
  const mahasiswa = "/ta/mahasiswa/sidang";

  return {
    getAll: (
      type: string,
      page: number,
      limit: number,
      search: string,
      status: string,
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${koor}?type=${type}&page=${page}&limit=${limit}&search=${search}&status=${status}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    update: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${koor}/${id}/update`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update sidang 1: ${error.message}`);
        });
    },

    getAllByDosen: (
      type: string,
      page: number,
      limit: number,
      search: string,
      status: string,
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${dosen}?type=${type}&page=${page}&limit=${limit}&search=${search}&status=${status}`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    // mahasiswa
    checkStatusSidang: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/ta2/check`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get jumlah bimbingan sidang 1: ${error.message}`,
          );
        });
    },

    getJumlahBimbingan: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/logbook-count`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get jumlah bimbingan sidang 1: ${error.message}`,
          );
        });
    },

    getDraftSidang: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/ta2`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get draft sidang 1: ${error.message}`);
        });
    },

    createDraftSidang: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/ta2`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get draft sidang 1: ${error.message}`);
        });
    },

    updateDraftSidang: (id: number, data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}${mahasiswa}/ta2/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update sidang 1: ${error.message}`);
        });
    },

    getGelombangAktif: (tipe?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = tipe
        ? `${baseUrl}${mahasiswa}/gelombang-aktif?tipe=${tipe}`
        : `${baseUrl}${mahasiswa}/gelombang-aktif`;

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get gelombang aktif: ${error.message}`);
        });
    },

    getHasilSidang: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/ta2/hasil`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get hasil sidang TA2: ${error.message}`);
        });
    },

    getJadwalSidangByDosen: (
      gelombangId: number | null,
      type?: string,
      search?: string,
    ) => {
      const headers = config();
      const params = new URLSearchParams();
      if (gelombangId !== null) params.set("gelombang_id", String(gelombangId));
      if (type) params.set("tipe", type);
      if (search) params.set("search", search);

      return fetch(`${baseUrl}/ta/dosen/sidang/jadwal-sidang?${params}`, {
        method: "GET",
        headers: headers,
      }).then((r) => r.json());
    },

    getHasilSidangByDosen: (
      gelombangId: number | null,
      type?: string,
      search?: string,
    ) => {
      const headers = config();
      const params = new URLSearchParams();
      if (gelombangId !== null) params.set("gelombang_id", String(gelombangId));
      if (type) params.set("tipe", type);
      if (search) params.set("search", search);

      return fetch(`${baseUrl}/ta/dosen/sidang/hasil-sidang?${params}`, {
        method: "GET",
        headers: headers,
      }).then((r) => r.json());
    },

    getAllGelombangByDosen: (tipe?: string) => {
      const headers = config();
      const params = new URLSearchParams();
      if (tipe) params.set("tipe", tipe);

      return fetch(`${baseUrl}/ta/dosen/sidang/gelombang?${params}`, {
        method: "GET",
        headers: headers,
      }).then((r) => r.json());
    },

    inputNilai: (sidangId: number, data: any) => {
      const headers = config();
      headers.append("Content-Type", "application/json");
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(
        `${baseUrl}/ta/dosen/sidang/${sidangId}/input-nilai`,
        requestConfig,
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in input nilai: ${error.message}`);
        });
    },

    downloadBeritaAcara: (sidangId: number, tipe: string) => {
      const params = new URLSearchParams({ tipe });
      return fetch(
        `${baseUrl}/ta/dosen/sidang/${sidangId}/berita-acara?${params}`,
        { method: "GET", headers: config() },
      );
    },
  };
};

export default MonitoringSidang2;
