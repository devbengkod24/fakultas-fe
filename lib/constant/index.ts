export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Fakultas Ilmu Komputer UDINUS";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION;
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_URL_V2 = process.env.NEXT_PUBLIC_API_URL_V2;
export const IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE;
export const SITE_COOKIES = {
  TOKEN: `${process.env.NEXT_PUBLIC_COOKIE_NAME}_token`,
};
export const SERVER_URL2 = process.env.NEXT_PUBLIC_SERVER_URL2;
export const API_CHATBOT_URL = process.env.NEXT_PUBLIC_API_CHATBOT_URL;
export const API_PUBLIKASI_URL = process.env.NEXT_PUBLIC_API_PUBLIKASI_URL;
export const USE_API_PROXY =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_USE_PROXY === "true";
export const API_BK_SYNC_LMS_URL = process.env.NEXT_PUBLIC_API_BK_SYNC_LMS_URL;
export const API_EWS_URL = process.env.NEXT_PUBLIC_API_EWS_URL;

// Single source of truth for who can access the EWS (Early Warning System) subapp.
// Previously duplicated with drifting values across withAuth.tsx, app-switcher.tsx,
// and apps/client-page.tsx — keep any future change to this list in one place.
export const EWS_ALLOWED_ROLES = [
  "super_fakultas",
  "admin",
  "mahasiswa",
] as const;
