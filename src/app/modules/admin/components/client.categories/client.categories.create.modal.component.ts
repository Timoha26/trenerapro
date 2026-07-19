import {Component, EventEmitter} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {ClientCategoryModel} from "../../../../models/client.category.model";
import {ClientCategoriesService} from "../../../../services/client.categories.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'client-categories-create-modal',
  templateUrl: 'client.categories.create.modal.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class ClientCategoriesCreateModalComponent {
  event: EventEmitter<ClientCategoryModel> = new EventEmitter<ClientCategoryModel>();

  newCategory: ClientCategoryModel = {
    name: undefined,
    slug: undefined
  };

  constructor(private modalRef: BsModalRef, private toastr: ToastrService, private clientCategoriesService: ClientCategoriesService) {
  }

  save() {
    this.clientCategoriesService.create(this.newCategory).subscribe({
      next: (data: ClientCategoryModel) => {
        this.event.emit(data);
        this.toastr.success('Уровень создан', 'Уровень подготовки');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Уровень подготовки');
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
