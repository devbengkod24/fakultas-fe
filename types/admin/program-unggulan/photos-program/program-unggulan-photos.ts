// @/types/admin/program-unggulan/program-unggulan/program-unggulan.ts
export interface PhotoActivity {
  id?: number;
  program_id: number;
  title: string;
  description: string;
  image: string;
  imageFile?: File;
  created_at?: string;
  updated_at?: string;

  // For displaying program name in table
  program?: {
    id: number;
    title: string;
  };
}
