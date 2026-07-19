import {SortByEnum} from "./sortBy.enum";

export interface QueryParametersModel {
  offset?: number;
  limit?: number;
  sort?: SortByEnum;
  desc?: boolean;
}
