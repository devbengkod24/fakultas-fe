export interface LeaderboardAuthor {
  rank: number;
  author_id: number;
  dosen_id?: number | null;
  name: string;
  article_count?: number;
  research_count?: number;
  avatar?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  message: string;
  data: LeaderboardAuthor[];
}
