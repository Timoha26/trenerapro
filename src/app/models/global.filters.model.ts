import {CoordsModel} from "./coords.model";

export interface GlobalFiltersModel {
  sportId?: number;
  settlementId?: number;
  coords?: CoordsModel;
  distance?: number;
  limit?: number;
}
