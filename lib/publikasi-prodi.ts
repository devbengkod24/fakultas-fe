interface ProdiIdentity {
  nama?: string | null;
  kode_prodi?: string | null;
}

const PUBLIKASI_PRODI_NAMES: Record<string, string> = {
  A11: "Teknik Informatika S1",
  A12: "Sistem Informasi S1",
  A14: "Desain Komunikasi Visual S1",
  A15: "Ilmu Komunikasi S1",
  A16: "Film dan Televisi D4",
  A17: "Animasi D4",
  A18: "PJJ Informatika S1",
  A22: "Teknik Informatika D3",
  P31: "Teknik Informatika S2",
  P41: "Ilmu Komputer S3",
};

export function getPublikasiProdiName(
  prodi?: ProdiIdentity | null,
): string | undefined {
  const kode = prodi?.kode_prodi?.trim().toUpperCase();
  if (kode && PUBLIKASI_PRODI_NAMES[kode]) {
    return PUBLIKASI_PRODI_NAMES[kode];
  }

  return prodi?.nama?.trim() || undefined;
}
