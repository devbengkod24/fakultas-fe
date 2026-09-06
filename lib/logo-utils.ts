import { IMAGE_URL } from "@/lib/constant";

/**
 * Konstruksi URL untuk logo lowongan
 * @param logoPath Path logo dari database (hanya filename)
 * @returns Full URL ke logo atau null jika tidak ada logo
 */
export function getLowonganLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) {
    return null;
  }

  // Jika sudah full URL, return as is
  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }

  // Konstruksi URL berdasarkan path storage
  return `${IMAGE_URL}/lowongan-logo/${logoPath}`;
}
