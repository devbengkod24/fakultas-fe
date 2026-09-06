// Article Statistics Types
export interface ArticleStatisticData {
  years: number[];
  articles_per_year: number[];
  scopus_count: number[];
  garuda_count: number[];
  scholar_count: number[];
}

export interface ArticleStatisticResponse {
  success: boolean;
  message: string;
  data: ArticleStatisticData;
}

// Research Statistics Types
export interface ResearchStatisticData {
  per_year: Record<string, number>;
  total_researches: number;
}

export interface ResearchStatisticResponse {
  success: boolean;
  message: string;
  data: ResearchStatisticData;
}

// Research Fund Types
export interface ResearchFundSource {
  [year: string]: {
    total_fund: string | number;
  };
}

export interface ResearchFundData {
  per_source: {
    INTERNAL_SOURCE: ResearchFundSource;
    BIMA_SOURCE: ResearchFundSource;
    SIMLITABMAS_SOURCE: ResearchFundSource;
  };
  total_all_fund: string;
}

export interface ResearchFundResponse {
  success: boolean;
  message: string;
  data: ResearchFundData;
}
