export type Publikasi = {
  id?: string;
  title: string;
  accred: string;
  abstract: string;
  year: number;
  article_url: string;
  journal: string;
  doi?: string;
  citation_count?: number;
  source?: string;
  authors: Author[];
};

interface Author {
  author_id: number;
  avatar: string;
  author_name: string;
  author_order: number;
  dosen_id?: number | null;
}
