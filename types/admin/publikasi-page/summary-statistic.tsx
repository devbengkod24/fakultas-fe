export interface SummaryStatistic {
  total_authors: number;
  total_articles: number;
  total_researches: number;
  total_article_authors: number;
  total_research_authors: number;
}

export interface SummaryStatisticResponse {
  success: boolean;
  message: string;
  data: SummaryStatistic;
}
