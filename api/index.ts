import { getCookie } from "cookies-next";
// Separate client-side import for useSWR
// SWR hanya dapat digunakan di client component
// import useSWR from "swr";

import Authentication from "./authentication/authentication";
import { API_URL, API_SYNC_URL, SITE_COOKIES } from "@/lib/constant";
import Pengumuman from "./admin-fakultas/pengumuman/pengumuman";
import PengumumanPublic from "./admin-fakultas/pengumuman/pengumuman-public";
import LinkGroup from "./link-group/link-group";
import ProdiConfigServiceDef from "./public/prodi-config";
import TrackVisitServiceDef from "./public/track-visit/track-visit";
import DosenFakultas from "./fakultas/dosen/dosen";
import Berita from "./admin-fakultas/berita/berita";
import AdminBerita from "./admin-fakultas/berita/admin-berita";
import StrukturOrganisasiServiceDef from "./admin-fakultas/struktur-organisasi/struktur-organisasi";
import Dosen from "./tugas-akhir/dosen";
import PublicDosenServiceDef from "./master/public-dosen";
import FakultasSync from "./fakultas-sync";

// Token Header Configuration
type TokenType = "Bearer";

// Helper function to get token from cookies - PRIMARY: document.cookie, FALLBACK: getCookie
const getTokenFromCookie = (cookieName: string): string | undefined => {
  if (!cookieName || cookieName === "undefined_token") {
    return undefined;
  }

  let token: string | undefined;

  // PRIMARY: Try to parse from document.cookie directly (more reliable on client-side)
  if (typeof window !== "undefined") {
    const name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        token = cookie.substring(name.length);
        break;
      }
    }
  }

  // FALLBACK: Try getCookie from cookies-next if document.cookie didn't work
  if (!token) {
    const fallbackCookie = getCookie(cookieName);
    token = typeof fallbackCookie === "string" ? fallbackCookie : undefined;
  }

  // Fallback: try discover token from any cookie that looks like auth token.
  if (!token && typeof window !== "undefined") {
    const decodedCookie = decodeURIComponent(document.cookie || "");
    const cookieArray = decodedCookie.split(";").map((item) => item.trim());

    // Prefer keys that end with _token, e.g. sti-dev-token_token.
    for (const cookie of cookieArray) {
      const [key, ...valueParts] = cookie.split("=");
      const value = valueParts.join("=").trim();
      if (!key || !value) continue;

      if (key.endsWith("_token") && value.length > 16) {
        token = value;
        break;
      }
    }

    // Last fallback: pick any JWT-looking cookie value (contains 3 segments).
    if (!token) {
      for (const cookie of cookieArray) {
        const [, ...valueParts] = cookie.split("=");
        const value = valueParts.join("=").trim();
        if (value && value.split(".").length === 3 && value.length > 30) {
          token = value;
          break;
        }
      }
    }
  }

  const normalizedToken = token?.replace(/^"|"$/g, "").trim();
  return normalizedToken || undefined;
};

const getAuthorizationHeader = (
  tokenType: TokenType = "Bearer",
  token?: string,
): string | undefined => {
  const tokenFromParam = token?.trim();
  const tokenFromCookie = getTokenFromCookie(SITE_COOKIES.TOKEN);
  const _token = tokenFromParam || tokenFromCookie;

  if (!_token) {
    return undefined;
  }

  return `${tokenType} ${_token}`;
};

// Configure Public Request Headers (No Cookies/Auth)
export const configurePublicHeaders = ({
  contentType = "application/json",
}: {
  contentType?: string;
} = {}) => {
  const headers = new Headers();
  headers.append("Content-Type", contentType);
  headers.append("Accept", "application/json");
  return headers;
};

// Configure Request Headers
export const configureHeaders = ({
  contentType = "application/json",
  tokenType = "Bearer",
  token = "",
  isFileUpload = false,
  accept,
  skipProdiId = false,
  prodiId,
}: {
  contentType?: string;
  tokenType?: TokenType;
  token?: string;
  isFileUpload?: boolean;
  accept?: string;
  skipProdiId?: boolean;
  prodiId?: number | string | null;
} = {}) => {
  const headers = new Headers();

  // Only set Content-Type if NOT file upload (FormData)
  if (!isFileUpload) {
    headers.append("Content-Type", contentType);
  }

  if (accept) {
    headers.append("Accept", accept);
  } else {
    headers.append("Accept", "application/json");
  }

  const authHeader = getAuthorizationHeader(tokenType, token);
  if (authHeader) {
    headers.append("Authorization", authHeader);
  }

  if (!skipProdiId) {
    const id =
      prodiId ??
      (typeof window !== "undefined" ? localStorage.getItem("active_prodi_id") : null);
    if (id) {
      headers.append("X-Prodi-Id", String(id));
    }
  }

  return headers;
};

// Fetcher for SWR
export const fetcher = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

// Export token getter for debugging
export const getAuthToken = () => {
  const token = getTokenFromCookie(SITE_COOKIES.TOKEN);
  return token;
};

// Export headers config for testing
export const testHeadersConfig = () => {
  const headers = configureHeaders();
  return headers;
};

// Custom Hook for SWR - hanya untuk digunakan di client component
// Ini dipindahkan ke helper/hooks/use-api.ts untuk menghindari error pada server component
/*
export const useApiData = (
  endpoint: string,
  options: {
    contentType?: string;
    tokenType?: TokenType;
    token?: string;
    isFileUpload?: boolean;
  } = {}
) => {
  const headers = configureHeaders(options);
  const { data, error, isLoading } = useSWR(`${API_URL}${endpoint}`, (url) =>
    fetcher(url, { headers })
  );

  return {
    data,
    error,
    isLoading,
  };
};
*/

export const AuthService = Authentication({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PengumumanService = {
  ...Pengumuman({
    baseUrl: API_URL || "",
    config: () => configureHeaders(),
  }),
  ...PengumumanPublic({
    baseUrl: API_URL || "",
    config: () => configureHeaders(),
  }),
};

export const LinkGroupService = LinkGroup({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PasswordService = Authentication({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DosenFakultasService = DosenFakultas({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const PublicDosenService = PublicDosenServiceDef({
  baseUrl: API_URL || "",
  config: () => configurePublicHeaders(),
});

export const DosenService = Dosen({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PublikasiDosenService = {
  getByDosenId: (dosenId: number) =>
    DosenFakultasService.getPublikasi(dosenId),
};

export const ProdiConfigService = ProdiConfigServiceDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PublicTrackVisitService = TrackVisitServiceDef({
  baseUrl: API_URL || "",
  config: () => configurePublicHeaders(),
});

export const BeritaService = Berita({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const AdminBeritaService = AdminBerita({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const StrukturOrganisasiService = StrukturOrganisasiServiceDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const FakultasSyncService = FakultasSync({
  baseUrl: API_SYNC_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});
