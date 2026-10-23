import {Component, Input, SimpleChanges} from "@angular/core";
import {CategoriesService} from "../../../../services/categories.service";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryModel} from "../../../../models/category.model";
import {CommonService} from "../../../../services/common.service";
import {CategoryTreeComponent} from "./category.tree.component";
import {CategoryTreeModel} from "../../../../models/category.tree.model";

@Component({
  selector: 'categories-select',
  templateUrl: 'categories.select.component.html',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    CategoryTreeComponent
  ],
  standalone: true
})
export class CategoriesSelectComponent {
  @Input() categoryIds: number[] = [];
  @Input() categories: CategoryModel[] = [];

  allCategories: CategoryModel[] = [];
  categoriesTree: CategoryTreeModel[] = [];

  constructor(private categoriesService: CategoriesService,
              private commonService: CommonService) {
  }

  checkboxChange([category, event]: [CategoryModel | undefined, any]) {
    if (category?.id == undefined) return;

    if (event.target.checked) {
      this.categoryIds.push(category.id);
      this.categories.push(category)
    } else {
      const idIndex = this.categoryIds.indexOf(category.id);
      if (idIndex > -1)
        this.categoryIds.splice(idIndex, 1);

      const index = this.commonService.getIndexInArrayById(category.id, this.categories);
      if (index > -1)
        this.categories.splice(index, 1);
    }
  }

  isChecked(categoryId: number | undefined): boolean {
    return this.categoryIds.includes(categoryId ?? 0);
  }

  private getCategories() {
    this.categoriesService.get().subscribe({
      next: data => {
        this.allCategories = data;
        this.categoriesTree = this.commonService.buildCategoriesTree(data);
      }
    });
  }

  ngOnInit() {
    this.getCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']) {
      const current = changes['categories'].currentValue as CategoryModel[];

      if (this.categoryIds.length < current.length)
        this.categoryIds = current.map(category => category.id ?? 0);
    }
  }
}
