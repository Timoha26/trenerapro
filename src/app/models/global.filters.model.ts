import {CoordsModel} from "./cities/coords.model";

export interface GlobalFiltersModel {
  sportId?: number;
  coords?: CoordsModel;
  distance?: number;
  limit?: number;
}
