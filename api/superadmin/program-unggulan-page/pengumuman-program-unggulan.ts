/* eslint-disable @typescript-eslint/no-explicit-any */
const ProgramUnggulanPengumumanService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const programUnggulan = "/cms/admin/program-unggulan/pengumuman";

  return {
    // Pengertian Section
    getProgramUnggulanPenggumuman: (
      page: any,
      limit: any,
      prodiId?: number
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${programUnggulan}?page=${page}&limit=${limit}`;
      if (prodiId) {
        url += `&prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all program unggulan pengumuman section: ${error.message}`
          );
        });
    },

    // ...existing code...
    getProgramUnggulanPengumumanByIdProgramUnggulan: (
      programId: number,
      page: number,
      limit: number,
      prodiId?: number
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${programUnggulan}/${programId}?page=${page}&limit=${limit}`;
      if (prodiId) {
        url += `&prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get pengumuman by program unggulan: ${error.message}`
          );
        });
    },
    // ...existing code...

    createProgramUnggulanPengumuman: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${programUnggulan}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in program unggulan pengumuman section: ${error.message}`
          );
        });
    },
    updateProgramUnggulanPengumuman: (id: number, data: any) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${programUnggulan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update program unggulan pengumuman section: ${error.message}`
          );
        });
    },
    deleteProgramUnggulanPengumuman: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${programUnggulan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete program unggulan pengumuman section: ${error.message}`
          );
        });
    },
  };
};

export default ProgramUnggulanPengumumanService;
