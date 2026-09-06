import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML sebelum masuk `dangerouslySetInnerHTML`. Backend gak selalu
 * bisa dijamin cuma ngirim HTML bersih (akun admin/koordinator ke-compromise,
 * bug BE, endpoint baru yang lupa divalidasi) — ini lapis pertahanan terakhir
 * di sisi render.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}
