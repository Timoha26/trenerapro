import {CategoryModel} from "./category.model";

export interface CategoryTreeModel extends CategoryModel {
  subCategories: CategoryTreeModel[];
}
