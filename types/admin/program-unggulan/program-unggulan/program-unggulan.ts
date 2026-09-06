export type ProgramUnggulan = {
  id?: number;
  title: string;
  short_desc: string;
  image: string | null;
  imageFile?: File;
  description: string;
  partner: string;
  duration: string;
  location: string;
  application_deadline: string;
  application_link: string;

  // Related data from API
  program_benefits?: Array<{
    id: number;
    program_id: number;
    benefit: string;
  }>;

  program_photos?: Array<{
    id: number;
    program_id: number;
    title: string;
    description: string;
    image: string;
    imageFile?: File; // Optional for form compatibility
  }>;

  program_requirements?: Array<{
    id: number;
    program_id: number;
    requirement: string;
  }>;

  detail_statistics?: Array<{
    id: number;
    program_id: number;
    statistic_id: number;
    value: number;
  }>;

  statistics?: Array<{
    id: number;
    name: string;
    pivot: {
      program_id: number;
      statistic_id: number;
      value: number;
    };
  }>;

  // Computed properties for form compatibility
  benefits?: string[];
  requirements?: string[];
  activityPhotos?: Array<{
    id?: number;
    title: string;
    description: string;
    image: string;
    imageFile?: File;
  }>;
  statisticsData?: Array<{
    name: string;
    value: number;
  }>;

  // For backward compatibility with existing form
  shortDesc?: string;
  applicationDeadline?: string;
  applicationLink?: string;
};
