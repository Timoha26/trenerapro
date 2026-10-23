import {Component, OnInit} from "@angular/core";
import {CategoriesService} from "../../services/categories.service";
import {Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {CategoryTreeModel} from "../../models/category.tree.model";
import {CategoryModel} from "../../models/category.model";
import {CategoryChainModel} from "../../models/category.chain.model";

@Component({
  selector: 'landing-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  allCategories: CategoryModel[] = [];
  treeCategories: CategoryTreeModel[] = [];
  viewCategories: CategoryTreeModel[] = [];
  chainCategories: CategoryChainModel[] = [];

  constructor(private router: Router,
              private categoriesService: CategoriesService,
              private commonService: CommonService) {
  }

  private getViewCategories(parentId?: number) {
    console.log(parentId);
    this.viewCategories = parentId ? this.commonService.getSubCategoriesById(this.treeCategories, parentId) ?? [] : this.treeCategories;
  }

  private getCategories() {
    this.categoriesService.get().subscribe({
      next: data => {
        this.allCategories = data;
        this.treeCategories = this.commonService.buildCategoriesTree(data);
        this.getViewCategories();
      }
    });
  }

  goToPageByCategory(category: CategoryTreeModel) {
    const chainCategory: CategoryChainModel = {
      id: category.id,
      name: category.name,
      subCategoriesExist: category.subCategories && category.subCategories.length > 0,
      parentId: category.parentId
    };

    this.goToPageByChain(chainCategory);
  }

  goToPageByChain(category?: CategoryChainModel) {
    if (!category) return;

    if (category.subCategoriesExist) {
      this.chainCategories = this.commonService.getChainCategories(category.id ?? 0, this.allCategories);
      this.getViewCategories(category.id);
    } else {
      this.commonService.onChangeGlobalCategoryId(category.id);
      this.router.navigate(['/trainers']);
    }
  }

  isLastChainCategory(categoryId: number, categories: CategoryChainModel[]): boolean {
    return categories.findIndex(c => c.id == categoryId) == categories.length - 1;
  }

  ngOnInit() {
    this.getCategories();
  }
}
