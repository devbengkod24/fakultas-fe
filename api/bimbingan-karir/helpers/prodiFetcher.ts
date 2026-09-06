"use client";

/**
 * Add prodi_id query parameter to URL
 * Gets activeProdiId from localStorage (set by ProfileContext)
 */
export const addProdiToUrl = (url: string, prodiId?: number | null): string => {
  // Get from localStorage if not provided (for use in API service files)
  const activeProdiId = prodiId ?? localStorage.getItem("activeProdiId");

  if (!activeProdiId) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}prodi_id=${activeProdiId}`;
};

/**
 * Get active prodi ID from localStorage
 */
export const getActiveProdiId = (): number | null => {
  const saved = localStorage.getItem("activeProdiId");
  return saved ? parseInt(saved, 10) : null;
};

/**
 * Fetch wrapper that auto-adds prodi_id to GET requests
 */
export const bkFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const urlWithProdi = addProdiToUrl(url);

  const headers = new Headers(options?.headers);
  const activeProdiId = getActiveProdiId();
  if (activeProdiId) {
    headers.set('X-Prodi-Id', activeProdiId.toString());
  }

  return fetch(urlWithProdi, {
    ...options,
    headers,
  });
};

/**
 * Check if prodi filtering should be applied
 * Returns false for endpoints that don't need prodi_id
 */
export const needsProdiFilter = (url: string): boolean => {
  // These endpoints don't need explicit prodi_id:
  // - /mahasiswa/* endpoints are filtered by auth (user's own data)
  // - /profile endpoint is user-specific
  const noProdiNeeded = [
    "/mahasiswa/",
    "/profile",
    "/auth/",
  ];

  return !noProdiNeeded.some((path) => url.includes(path));
};