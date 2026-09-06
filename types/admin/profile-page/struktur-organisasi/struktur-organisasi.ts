export type StrukturOrganisasi = {
  id?: number;
  name: string;
  position: string;
  image: string;
  imageFile?: File;
  order_no?: string; // Optional field for ordering
};
