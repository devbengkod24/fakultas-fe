/* eslint-disable @typescript-eslint/no-explicit-any */

const Auth = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: (options?: any) => Headers;
}) => {
  return {
    loginAdmin: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(`${baseUrl}/login-admin`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error login admin: ${error.message}`);
        });
    },
    loginSuperFakultas: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(`${baseUrl}/login-super-fakultas`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error login super-fakultas: ${error.message}`);
        });
    },
    loginMahasiswa: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };

      return fetch(`${baseUrl}/login-mahasiswa`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error login mahasiswa: ${error.message}`);
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
          throw new Error(`Error get profile: ${error.message}`);
        });
    },
  };
};

export default Auth;
