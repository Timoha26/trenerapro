import {Component, OnInit} from "@angular/core";
import {CategoriesService} from "../../services/categories.service";
import {Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {CategoryTreeModel} from "../../models/category.tree.model";
import {CategoryModel} from "../../models/category.model";

@Component({
  selector: 'landing-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  allCategories: CategoryModel[] = [];
  treeCategories: CategoryTreeModel[] = [];
  viewCategories: CategoryTreeModel[] = [];
  prevParentId?: number = undefined;
  gotoSteps: number = 0;

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

  public goToBack() {
    this.getViewCategories(this.prevParentId);
    this.gotoSteps--;
    if (this.allCategories && this.allCategories.length > 0) {
      const prevCategory = this.allCategories.find(s => s.id == this.prevParentId);

      if (prevCategory)
        this.prevParentId = prevCategory.parentId;
    }
  }

  public goToPage(category?: CategoryTreeModel) {
    if (!category) return;

    if (category.subCategories && category.subCategories.length > 0) {
      this.prevParentId = category.parentId;
      this.gotoSteps++;

      this.getViewCategories(category.id);
    } else {
      this.commonService.onChangeGlobalCategoryId(category.id);
      this.router.navigate(['/trainers']);
    }
  }

  ngOnInit() {
    this.getCategories();
  }
}
