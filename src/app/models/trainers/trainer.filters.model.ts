import {QueryParametersModel} from "../query.parameters.model";

export interface TrainerFiltersModel extends QueryParametersModel {
  settlementIds?: number[];
  sportIds?: number[];
  clientCategoryIds?: number[];
  trainingFormatIds?: number[];
  verified?: boolean;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
}
