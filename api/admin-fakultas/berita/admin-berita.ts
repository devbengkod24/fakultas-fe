import { getCookie } from "cookies-next";
import { SITE_COOKIES } from "@/lib/constant";

const AdminBerita = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  // baseUrl already includes /api/v1, so path starts with /cms/...
  const berita = "/cms/admin-fakultas/berita";

  // Create headers for FormData (no Content-Type, let browser set it)
  const getFormDataHeaders = () => {
    const headers = new Headers();
    headers.append("Accept", "application/json");

    const sanitizeToken = (token?: string | null) =>
      token?.replace(/^\"|\"$/g, "").trim();

    const configHeaders = config();
    const authHeader = configHeaders.get("Authorization")?.trim();
    const isValidAuthHeader =
      !!authHeader &&
      authHeader.startsWith("Bearer ") &&
      authHeader !== "Bearer" &&
      authHeader !== "Bearer undefined" &&
      authHeader !== "Bearer null";

    if (isValidAuthHeader) {
      headers.append("Authorization", authHeader);
      console.log("[getFormDataHeaders] ✓ Authorization header copied from config()");
    } else {
      console.error("[getFormDataHeaders] ✗ Authorization header missing/invalid from config()", {
        authHeader,
      });

      // Deterministic fallback: read exact configured token cookie.
      const cookieToken = sanitizeToken(
        typeof getCookie(SITE_COOKIES.TOKEN) === "string"
          ? (getCookie(SITE_COOKIES.TOKEN) as string)
          : undefined
      );

      if (cookieToken) {
        headers.set("Authorization", `Bearer ${cookieToken}`);
        console.log("[getFormDataHeaders] ✓ Authorization header set from cookies-next fallback");
      }
    }

    console.log("[getFormDataHeaders] Final headers:", {
      hasAuth: headers.get("Authorization") ? "✓" : "✗",
      hasAccept: headers.get("Accept") ? "✓" : "✗",
      hasContentType: headers.get("Content-Type") ? "✗ (bad)" : "✓ (good)",
    });
    
    return headers;
  };

  return {
    getBeritaList: (
      page: number = 1,
      limit: number = 10,
      search: string = "",
      type: string = "",
      month: string = "",
      year: string = "",
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${berita}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      if (type && type !== "all") {
        url += `&type=${encodeURIComponent(type)}`;
      }
      if (month) {
        url += `&month=${encodeURIComponent(month)}`;
      }
      if (year) {
        url += `&year=${encodeURIComponent(year)}`;
      }

      return fetch(url, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error fetching berita list: ${error.message}`);
        });
    },

    getBeritaById: (id: number) => {
      const headers = config();
      const url = `${baseUrl}${berita}/${id}`;
      
      console.log("[AdminBerita.getBeritaById] Fetching berita detail", {
        id,
        url,
        hasAuth: headers.get("Authorization") ? "yes" : "no",
      });
      
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      
      return fetch(url, requestConfig)
        .then((response) => {
          console.log("[AdminBerita.getBeritaById] Response status:", response.status);
          if (!response.ok) {
            return response.text().then((text) => {
              console.error("[AdminBerita.getBeritaById] Error response:", text);
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            });
          }
          return response.json();
        })
        .catch((error) => {
          console.error("[AdminBerita.getBeritaById] Fetch error:", error);
          throw new Error(`Error fetching berita by ID: ${error.message}`);
        });
    },

    createBerita: (data: FormData) => {
      const fullUrl = `${baseUrl}${berita}`;
      const headers = getFormDataHeaders();

      console.log("[AdminBerita.createBerita] 🚀 Creating berita...", fullUrl);

      return fetch(fullUrl, {
        method: "POST",
        body: data,
        headers: headers,
      })
        .then(async (response) => {
          console.log("[AdminBerita.createBerita] Response:", {
            status: response.status,
            statusText: response.statusText,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("[AdminBerita.createBerita] Error response:", errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          try {
            const json = await response.json();
            console.log("[AdminBerita.createBerita] ✅ Success:", json);
            return json;
          } catch (parseError) {
            console.error("[AdminBerita.createBerita] JSON parse error:", parseError);
            throw new Error(`Failed to parse response: ${parseError}`);
          }
        })
        .catch((error) => {
          console.error("[AdminBerita.createBerita] ❌ Fetch error:", error.message);
          throw new Error(`Error in create berita: ${error.message}`);
        });
    },

    updateBerita: async (id: number, data: FormData) => {
      const url = `${baseUrl}${berita}/${id}`;
      console.log("[AdminBerita.updateBerita] Updating berita:", id, url);

      const buildRequestData = (withMethodSpoof: boolean) => {
        const body = new FormData();
        data.forEach((value, key) => {
          body.append(key, value);
        });
        if (withMethodSpoof) {
          body.append("_method", "PUT");
        }
        return body;
      };

      const headers = getFormDataHeaders();
      console.log("[AdminBerita.updateBerita] Header snapshot", {
        hasAuth: headers.get("Authorization") ? "yes" : "no",
      });

      let response: Response;
      try {
        // POST with _method=PUT spoofing (no credentials: include to avoid CORS preflight)
        response = await fetch(url, {
          method: "POST",
          body: buildRequestData(true),
          headers: headers,
        });
      } catch (networkErr) {
        console.error("[AdminBerita.updateBerita] Network error:", networkErr);
        throw new Error(`Network error: ${networkErr instanceof Error ? networkErr.message : String(networkErr)}`);
      }

      console.log("[AdminBerita.updateBerita] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[AdminBerita.updateBerita] Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },

    deleteBerita: (id: number) => {
      const url = `${baseUrl}${berita}/${id}`;
      const headers = getFormDataHeaders();

      console.log("[AdminBerita.deleteBerita] Deleting berita:", id, url);

      const deleteData = new FormData();
      deleteData.append("_method", "DELETE");

      return fetch(url, {
        method: "POST",
        body: deleteData,
        headers: headers,
      })
        .then(async (response) => {
          console.log("[AdminBerita.deleteBerita] Response status:", response.status);
          if (!response.ok) {
            const text = await response.text();
            console.error("[AdminBerita.deleteBerita] Error response:", text);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error("[AdminBerita.deleteBerita] Fetch error:", error);
          throw new Error(`Error in delete berita: ${error.message}`);
        });
    },
  };
};

export default AdminBerita;
