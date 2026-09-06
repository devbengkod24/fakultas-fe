const Dashboard = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const mahasiswa = "/ta/mahasiswa/dashboard";
  const koor = "/ta/koor-ta/dashboard";
  const dosen = "/ta/dosen/dashboard";

  return {
    /**
        {
        "success": true,
        "message": "Progress berhasil diambil",
        "data": {
            "true": 1,
            "false": 4,
            "percentage": 20
        }
    */
    getProgress: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/progress`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    getProgressPercentage: (in_percentage?: boolean) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${mahasiswa}/progress?in_percentage=${in_percentage}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    /**
         {
            "success": true,
            "message": "Logbook berhasil diambil",
            "data": {
                "jumlah_bab": 2,
                "bab_terakhir": 5
            }
        }
    */
    getLogbookCount: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/logbook-count`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    /**
    {
        "success": true,
        "message": "Pengajuan Tugas Akhir berhasil diambil",
        "data": {
            "status": "accepted",
            "dosen_pembimbing": " EDY MULYANTO SSi, M.Kom"
        }
    }
    */
    getLastPengajuan: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/last-pengajuan`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    /**
    {
        "success": true,
        "message": "Ringkasan Logbook berhasil diambil",
        "data": {
            "jumlah_logbook": 2,
            "logbook_terbaru": "2025-06-15 17:13:01",
            "catatan_terakhir": "Vel nostrud cum quis"
        }
    }        
    */
    getRingkasanLogbook: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/ringkasan-logbook`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    /**
       * {
        "success": true,
        "message": "Periode aktif berhasil diambil",
        "data": {
            "tgl_awal_ta": "2025-05-30",
            "tgl_akhir_ta": "2025-07-30"
        }
      }
    **/
    getRangePeriode: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${mahasiswa}/range-periode`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error range periode: ${error.message}`);
        });
    },

    /**
      {
          "success": true,
          "data": [
              {
                  "label": 20242,
                  "total_mahasiswa": 926
              },
              {
                  "label": 20251,
                  "total_mahasiswa": 60
              }
          ],
          "periode_sekarang": {
              "id": 11,
              "kode_periode": 20251,
              "tahun_ajaran": "2025 - 2026 Ganjil",
              "status": 1,
              "tgl_awal": "2025-06-16",
              "tgl_akhir": "2025-07-11",
              "tgl_awal_ta": "2025-05-31",
              "tgl_akhir_ta": "2025-08-30"
          }
      }
    */
    getLogbookStatistic: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koor}/statistic-logbook`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    /**
     * 
     * @returns {
    "success": true,
        "data": {
            "chart": [
                {
                    "periode": 20242,
                    "students": 926,
                    "label": "2024 - 2025 Genap"
                },
                {
                    "periode": 20251,
                    "students": 60,
                    "label": "2025 - 2026 Ganjil"
                }
            ],
            "periode_sekarang": "2025 - 2026 Ganjil"
        }
    }
     */

    getMahasiswaStatistic: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${koor}/jumlah-mahasiswa-by-periode-kode`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    getCurrentPeriode: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koor}/periode-sekarang`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    getKoorKuotaCount: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${koor}/alokasi-kuota`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    getKoorPengajuan: (type: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${koor}/pengajuan-list?type=${type}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sidang 1: ${error.message}`);
        });
    },

    // dosen
    getDosenLogbookStatistic: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/statistic-logbook`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all logbook: ${error.message}`);
        });
    },

    getTaChart: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/mahasiswa-ta`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all logbook: ${error.message}`);
        });
    },

    getDosenKuotaCount: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/kuota-by-dosen`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all logbook: ${error.message}`);
        });
    },

    getDosenPengajuan: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${dosen}/5-pengajuan-terbaru`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all logbook: ${error.message}`);
        });
    },

    getPendingLogbook: (page: number, limit: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}/ta/dosen/logbook/mahasiswa/pending?page=${page}&limit=${limit}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all mahasiswa: ${error.message}`);
        });
    },

    /**
     * Ambil link_wa dosen pembimbing TA milik dosen yang sedang login.
     * Endpoint: GET /api/v1/ta/dosen/link-wa
     * Sumber data: dosen_periode.link_wa (kategori='ta').
     * Return: { success, message, data: string|null }
     */
    getLinkWaDosen: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/dosen/link-wa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get link WA dosen: ${error.message}`);
        });
    },

    updateLinkWaDosen: (data: { link_wa: string }) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/dosen/link-wa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error update link WA dosen: ${error.message}`);
        });
    },

    /**
     * Ambil link_wa dosen pembimbing TA untuk mahasiswa yang sedang login.
     * Endpoint: GET /api/v1/ta/mahasiswa/dosen-link-wa
     * Sumber data: dosen_periode.link_wa (via TA project → dosen_id)
     * Return: { success, message, data: string|null }
     */
    getDosenLinkWa: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}/ta/mahasiswa/dosen-link-wa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get dosen link wa (mahasiswa): ${error.message}`
          );
        });
    },
  };
};

export default Dashboard;
