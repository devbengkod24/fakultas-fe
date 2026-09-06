export type SambutanDekan = {
  id?: number;
  name: string;
  image: string;
  paragraph: string;
  prodi_id?: number | string;
  imageFile?: File; // Optional file for upload
};
