import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CategoryTreeModel} from "../../../../models/category.tree.model";
import {CategoryModel} from "../../../../models/category.model";

@Component({
  selector: 'admin-category-tree',
  standalone: true,
  templateUrl: './category.tree.component.html',
  imports: [CommonModule]
})
export class CategoryTreeComponent {
  @Input({required: true}) categories: CategoryTreeModel[] = [];
  @Input({required: true}) lite: boolean = true;
  @Input({required: true}) editable: boolean = false;
  @Input({required: true}) selectable: boolean = false;
  @Input() categoryIds: number[] = [];
  @Output() addAction = new EventEmitter<number>();
  @Output() editAction = new EventEmitter<number>();
  @Output() removeAction = new EventEmitter<number>();
  @Output() checkboxChangeAction = new EventEmitter<[category: CategoryModel | undefined, event: any]>();

  add(parentId?: number) {
    this.addAction.emit(parentId);
  }

  edit(categoryId?: number) {
    if(!categoryId) {
      console.error("Category ID is missing");
      return;
    }

    this.editAction.emit(categoryId);
  }

  remove(categoryId?: number) {
    if(!categoryId) {
      console.error("Category ID is missing");
      return;
    }

    this.removeAction.emit(categoryId);
  }

  isChecked(categoryId: number | undefined): boolean {
    return this.categoryIds.includes(categoryId ?? 0);
  }

  checkboxChange([category, event]: [CategoryModel | undefined, any]){
    this.checkboxChangeAction.emit([category, event]);
  }
}
