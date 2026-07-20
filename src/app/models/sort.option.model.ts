import {SortByEnum} from "./sortBy.enum";

export interface SortOptionModel {
  sort: SortByEnum;
  desc: boolean;
  name: string;
}
