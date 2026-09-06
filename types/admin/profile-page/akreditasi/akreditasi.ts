export type Akreditasi = {
  id?: number; // Changed from string to number to match API response
  image: string; // URL string untuk display/preview
  title: string;
  description: string;
  accred: string;
  imageFile?: File; // File object untuk upload
};
