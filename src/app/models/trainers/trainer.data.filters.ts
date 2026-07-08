export interface TrainerDataFilters {
  settlementIds?: number[];
  sportIds?: number[];
  clientCategoryIds?: number[];
  trainingFormatIds?: number[];
  verified?: boolean;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
}
