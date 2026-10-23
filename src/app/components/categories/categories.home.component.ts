import {Component, effect, OnInit} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {CategoryModel} from "../../models/category.model";
import {CategoriesService} from "../../services/categories.service";
import {CommonService} from "../../services/common.service";
import {ResizeTrackerDirective} from "../../directives/resizeTracker.directive";
import {CategoryTreeModel} from "../../models/category.tree.model";

@Component({
  selector: 'categories',
  templateUrl: './categories.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    ResizeTrackerDirective
  ]
})
export class CategoriesHomeComponent implements OnInit {

  public currentId?: number = undefined;

  allCategories: CategoryModel[] = [];
  treeCategories: CategoryTreeModel[] = [];
  viewCategories: CategoryTreeModel[] = [];
  displayedCategories: CategoryTreeModel[] = [...this.viewCategories];
  prevParentId?: number = undefined;
  gotoSteps: number = 0;
  isSmallScreen: boolean = false;

  constructor(private router: Router,
              private categoriesService: CategoriesService,
              private commonService: CommonService) {
    effect(() => {
      const globalFilters = this.commonService.globalFilters();
      this.currentId = globalFilters.categoryId;
    });
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

  private getViewCategories(parentId?: number){
    this.viewCategories = parentId ? this.commonService.getSubCategoriesById(this.treeCategories, parentId) ?? [] : this.treeCategories;

    this.onResize(this.isSmallScreen);
  }

  onResize(isSmallScreen: boolean): void {
    this.isSmallScreen = isSmallScreen;
    if (isSmallScreen) {
      this.displayedCategories = this.viewCategories.slice(0, 4);
    } else {
      this.displayedCategories = this.viewCategories.slice(0, 12);
    }
  }

  public goToBack() {
    this.getViewCategories(this.prevParentId);
    this.gotoSteps--;
    if(this.allCategories && this.allCategories.length > 0) {
      const prevCategory = this.allCategories.find(s => s.id == this.prevParentId);

      if(prevCategory)
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
    this.commonService.onChangeGlobalCategoryId(undefined);
    this.getCategories();
  }
}
