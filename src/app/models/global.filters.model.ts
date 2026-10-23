import {CoordsModel} from "./coords.model";
import {SortByEnum} from "./sortBy.enum";

export interface GlobalFiltersModel {
  categoryId?: number;
  settlementId?: number;
  coords?: CoordsModel;
  userCoords?: CoordsModel;
  distance?: number;
  limit?: number;
  sort?: SortByEnum;
  desc?: boolean;
}
