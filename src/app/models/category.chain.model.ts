import {CategoryModel} from "./category.model";

export interface CategoryChainModel {
  id?: number;
  name?: string;
  subCategoriesExist: boolean;
  parentId?: number;
}
