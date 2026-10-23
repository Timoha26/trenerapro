import {QueryParametersModel} from "../query.parameters.model";
import {CoordsModel} from "../coords.model";

export interface ClubFiltersModel extends QueryParametersModel {
  coords?: CoordsModel;
  distance?: number;
  settlementIds?: number[],
  categoryIds?: number[],
  verified?: boolean,
  minRating?: number
}
