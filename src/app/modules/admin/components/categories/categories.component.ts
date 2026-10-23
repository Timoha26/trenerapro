import {Component} from "@angular/core";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {CategoryModel} from "../../../../models/category.model";
import {ConfirmationModalComponent} from "../confirmation.modal/confirmation.modal.component";
import {CategoriesService} from "../../../../services/categories.service";
import {CategoryCreateModalComponent} from "./category.create.modal.component";
import {CategoryTreeModel} from "../../../../models/category.tree.model";
import {CommonService} from "../../../../services/common.service";

@Component({
  selector: 'admin-categories',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent {
  modalRef?: BsModalRef;

  categoriesTree: CategoryTreeModel[] = [];

  private categories: CategoryModel[] = [];

  constructor(private categoriesService: CategoriesService,
              private modalService: BsModalService,
              private commonService: CommonService) {
  }

  private getCategories() {
    this.categoriesService.get().subscribe({
      next: data => {
        this.categories = data;
        this.categoriesTree = this.commonService.buildCategoriesTree(data);
      }
    });
  }

  addCategory(parentId?: number) {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        parentId: parentId
      }
    };

    this.modalRef = this.modalService.show(CategoryCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (category: CategoryModel) => {
        if (category)
          this.getCategories();
      }
    });
  }

  editCategory(categoryId: number) {
    console.log('click to edit', categoryId);
  }

  remove(categoryId: number) {
    const category = this.categories.find(category => category.id === categoryId);

    if(!category) {
      console.error('category not found');
      return;
    }

    const confirmRemoveModalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        title: 'Вы уверены?',
        text: 'Категория <b>' + category.name + '</b> будет удалена'
      }
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);

    this.modalRef.content.event.subscribe({
      next: (isConfirmed: boolean) => {
        if (isConfirmed)
          this.categoriesService.remove(category.id ?? 0).subscribe({next: data => this.getCategories()});
      }
    });
  }

  ngOnInit() {
    this.getCategories();
  }
}
