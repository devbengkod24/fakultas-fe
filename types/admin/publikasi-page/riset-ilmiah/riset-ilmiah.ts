export type Research = {
  id?: string;
  title: string;
  leader_name: string;
  jenis_penelitian?: string;
  personils?: string;
  personnel?: string[] | string;
  year: string | number;
  dana_penelitian?: number;
  budget?: string;
  status_penelitian?: string;
  status?: string;
  sumber_pendanaan?: string;
  fund_source?: string;
  sourceType?: string;
  author_name?: string;
  author_id?: number;
  dosen_id?: number | null;
};
