export interface SortConfig {
  nim?: "asc" | "desc";
  name?: "asc" | "desc";
  npp?: "asc" | "desc";
  pembimbing?: 0 | 1 | "asc" | "desc" | "none";
}

export interface SortOption {
  value: string;
  label: string;
  sortConfig: SortConfig;
}