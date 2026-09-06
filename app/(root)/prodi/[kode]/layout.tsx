import HeaderProdi from "@/app/(root)/prodi/[kode]/header-prodi";
import FooterProdi from "@/app/(root)/prodi/[kode]/footer-prodi";
import { ProdiConfigService } from "@/api";
import { ProdiConfig } from "../config";
import { getProdiTheme } from "@/lib/landing-page-prodi/prodi-themes";
import { CSSProperties } from "react";
import { notFound } from "next/navigation";

/**
 * Layout untuk semua halaman landing per Prodi.
 * Menggunakan dynamic route [kode], validasi kode terhadap database via API.
 */
export default async function ProdiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  
  // Fetch prodi data directly from API
  let prodi: ProdiConfig | null = null;
  
  try {
    const response = await ProdiConfigService.getByKode(kode);
    prodi = response?.data || null;
  } catch (error) {
    console.error("Error fetching prodi for layout:", error);
  }

  // Kode prodi tidak valid atau API error → Trigger 404
  if (!prodi) {
    notFound();
  }

  // Get branding theme
  const theme = getProdiTheme(kode);

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{
        "--prodi-primary": theme.primary,
        "--prodi-primary-light": theme.primaryLight,
        "--prodi-secondary": theme.secondary,
        "--prodi-subtle": theme.subtle,
        "--prodi-gradient-start": theme.gradientStart,
        "--prodi-gradient-end": theme.gradientEnd,
      } as CSSProperties}
    >
      <HeaderProdi />
      {children}
      <FooterProdi prodiName={prodi.nama} />
    </div>
  );
}

/**
 * Generate static params untuk semua prodi dari database.
 */
export async function generateStaticParams() {
  try {
    const response = await ProdiConfigService.getAll();
    const prodis = response?.data || [];
    
    return prodis.map((p: any) => ({
      kode: p.kode_prodi,
    }));
  } catch (error) {
    console.error("Error generating static params for prodi:", error);
    return [];
  }
}
