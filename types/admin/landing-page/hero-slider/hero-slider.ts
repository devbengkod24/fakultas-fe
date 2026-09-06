export type HeroSlider = {
  id?: number;
  image: string;
  title: string;
  subtitle: string;
  imageFile?: File;
  isActive?: number; // 0 = tidak aktif, 1 = aktif
};
