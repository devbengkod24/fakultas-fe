/* eslint-disable @typescript-eslint/no-explicit-any */
const Authentication = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  return {
    login: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}/login`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in login: ${error.message}`);
        });
    },
    getProfile: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}/profile`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in getProfile: ${error.message}`);
        });
    },
    updateMahasiswa: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}/ta/mahasiswa/update-profile`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in login: ${error.message}`);
        });
    },

    // ─── UPDATE PROFIL DOSEN (dari akun dosen sendiri) ───
    updateDosenProfile: (data: {
      name?: string;
      bidang_kajian?: string;
      scholar_link?: string;
      telepon?: string;
      email_alternatif?: string;
    }) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}/dosen/profile`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in updateDosenProfile: ${error.message}`);
        });
    },

    redirectGoogle: () => {
      const baseUrlWithoutApi = baseUrl.replace(/\/api\/v1$/, "");
      window.location.href = `${baseUrlWithoutApi}/api/google/redirect`;
    },

    updatePassword: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}/profile`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update password: ${error.message}`);
        });
    },

    updateMinatMhs: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      };
      return fetch(`${baseUrl}/bk/minat-mahasiswa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in updateMinatMhs: ${error.message}`);
        });
    },

    getMinatMahasiswa: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}/bk/minat-mahasiswa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all minat mahasiswa: ${error.message}`);
        });
    },
  };
};

export default Authentication;