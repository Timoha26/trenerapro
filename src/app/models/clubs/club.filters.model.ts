import {QueryParametersModel} from "../query.parameters.model";

export interface ClubFiltersModel extends QueryParametersModel {
  settlementIds?: number[],
  sportIds?: number[],
  verified?: boolean,
  minRating?: number
}
