import {EntityTypeEnum} from "./entity.type.enum";

export interface SearchItemModel {
  entityType?: EntityTypeEnum;
  entityId?: number;
  entityTitle?: string;
}
