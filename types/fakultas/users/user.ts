export type AkunUser = {
  id?: number;
  name: string;
  email: string;
  roles?: string[];
  permissions: string[];
  password?: string;
  prodi_id?: number;
  dosen_id?: number | null;
  dosen_name?: string | null;
};
