export type PengumumanProgram = {
  id?: number;
  title: string;
  description: string;
  date: string;
  program_id: number;
  type: "hasil" | "pendaftaran" | "acara";
  created_at?: string;
  updated_at?: string;

  // For displaying program name in table
  program?: {
    id: number;
    title: string;
  };
};
