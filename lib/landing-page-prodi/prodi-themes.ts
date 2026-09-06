export interface ProdiTheme {
  primary: string;       // Utama
  primaryLight: string;  // Untuk hover/light elements
  secondary: string;     // Aksen 
  subtle: string;        // Background sangat muda
  gradientStart: string; // Sama dengan primary
  gradientEnd: string;   // Untuk efek gradasi
}

// Fallback menggunakan warna resmi standar logo UDINUS
export const DEFAULT_THEME: ProdiTheme = {
  primary: "#114D91",
  primaryLight: "#3B76B9",
  secondary: "#F3BC45",
  subtle: "#EFF6FF",
  gradientStart: "#114D91",
  gradientEnd: "#3B76B9",
};

export const PRODI_THEMES: Record<string, ProdiTheme> = {
  // --- RUMPUN TEKNIK INFORMATIKA (A11, A22, P31, P41, A18) ---
  "A11": { 
    primary: "#0855a6", 
    primaryLight: "#347bd6",
    secondary: "#f58a56",
    subtle: "#eef4fc",
    gradientStart: "#0855a6",
    gradientEnd: "#347bd6",
  },
  "A22": { 
    primary: "#0855a6", 
    primaryLight: "#347bd6",
    secondary: "#f58a56",
    subtle: "#eef4fc",
    gradientStart: "#0855a6",
    gradientEnd: "#347bd6",
  },
  "P31": { 
    primary: "#0855a6", 
    primaryLight: "#347bd6",
    secondary: "#f58a56",
    subtle: "#eef4fc",
    gradientStart: "#0855a6",
    gradientEnd: "#347bd6",
  },
  "P41": { 
    primary: "#0855a6", 
    primaryLight: "#347bd6",
    secondary: "#f58a56",
    subtle: "#eef4fc",
    gradientStart: "#0855a6",
    gradientEnd: "#347bd6",
  },
  "A18": { 
    primary: "#0855a6", 
    primaryLight: "#347bd6",
    secondary: "#f58a56",
    subtle: "#eef4fc",
    gradientStart: "#0855a6",
    gradientEnd: "#347bd6",
  },

  // --- PROGRAM STUDI LAINNYA ---
  "A12": { // Sistem Informasi
    primary: "#0000fe",
    primaryLight: "#4d4dff",
    secondary: "#fefe00", 
    subtle: "#eef0ff",
    gradientStart: "#0000fe",
    gradientEnd: "#4d4dff",
  },
  "A14": { // Desain Komunikasi Visual
    primary: "#185979",
    primaryLight: "#2c789e",
    secondary: "#f5ae20",
    subtle: "#eff5f8",
    gradientStart: "#185979",
    gradientEnd: "#2c789e",
  },
  "A15": { // Ilmu Komunikasi
    primary: "#1d80c3",
    primaryLight: "#4ca3df",
    secondary: "#ecaa32",
    subtle: "#f0f7fd",
    gradientStart: "#1d80c3",
    gradientEnd: "#4ca3df",
  },
  "A16": { // Film & Televisi
    primary: "#1a76b9",
    primaryLight: "#4393d1",
    secondary: "#eb1b28",
    subtle: "#eff6fb",
    gradientStart: "#1a76b9",
    gradientEnd: "#4393d1",
  },
  "A17": { // Animasi
    primary: "#011e3a",
    primaryLight: "#0b3866",
    secondary: "#fe6601",
    subtle: "#eef3f8",
    gradientStart: "#011e3a",
    gradientEnd: "#0b3866",
  },
};

export const getProdiTheme = (kode?: string): ProdiTheme => {
  if (!kode) return DEFAULT_THEME;
  const upperKode = kode.toUpperCase();
  return PRODI_THEMES[upperKode] || DEFAULT_THEME;
};