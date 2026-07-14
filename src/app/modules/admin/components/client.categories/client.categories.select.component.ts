import {Component, Input} from "@angular/core";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ClientCategoriesCreateModalComponent} from "./client.categories.create.modal.component";
import {ClientCategoryModel} from "../../../../models/client.category.model";
import {ClientCategoriesService} from "../../../../services/client.categories.service";

@Component({
  selector: 'client-categories-select',
  templateUrl: 'client.categories.select.component.html',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true
})
export class ClientCategoriesSelectComponent {
  @Input() clientCategoryIds: number[] = [];

  categories: ClientCategoryModel[] = [];

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private clientCategoriesService: ClientCategoriesService) {
  }

  checkboxChange(categoryId: number | undefined, event: any) {
    if (categoryId == undefined) return;

    if (event.target.checked) {
      this.clientCategoryIds.push(categoryId);
    } else {
      const index = this.clientCategoryIds.indexOf(categoryId);
      if (index > -1)
        this.clientCategoryIds.splice(index, 1);
    }
  }

  isChecked(categoryId: number | undefined): boolean {
    return this.clientCategoryIds.includes(categoryId ?? 0);
  }

  addCategory() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(ClientCategoriesCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (category: ClientCategoryModel) => {
        if (category)
          this.categories.push(category);
      }
    });
  }

  private getCategories() {
    this.clientCategoriesService.get().subscribe({next: data => this.categories = data});
  }

  ngOnInit() {
    this.getCategories();
  }
}
