import {QueryParametersModel} from "../query.parameters.model";
import {CoordsModel} from "../coords.model";

export interface TrainerFiltersModel extends QueryParametersModel {
  coords?: CoordsModel;
  distance?: number;
  settlementIds?: number[];
  categoryIds?: number[];
  clientCategoryIds?: number[];
  trainingFormatIds?: number[];
  verified?: boolean;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
}
