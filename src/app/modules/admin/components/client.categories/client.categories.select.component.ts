import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ClientCategoriesCreateModalComponent} from "./client.categories.create.modal.component";
import {ClientCategoryModel} from "../../../../models/client.category.model";
import {ClientCategoriesService} from "../../../../services/client.categories.service";
import {CommonService} from "../../../../services/common.service";

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
export class ClientCategoriesSelectComponent implements OnInit, OnChanges {
  @Input() clientCategoryIds: number[] = [];
  @Input() clientCategories: ClientCategoryModel[] = [];

  categories: ClientCategoryModel[] = [];

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService,
              private clientCategoriesService: ClientCategoriesService,
              private commonService: CommonService) {
  }

  checkboxChange(category: ClientCategoryModel | undefined, event: any) {
    if (category?.id == undefined) return;

    if (event.target.checked) {
      this.clientCategoryIds.push(category.id);
      this.clientCategories.push(category);
    } else {
      const indexId = this.clientCategoryIds.indexOf(category.id);
      if (indexId > -1)
        this.clientCategoryIds.splice(indexId, 1);

      const indexClient = this.commonService.getIndexInArrayById(category.id, this.clientCategories);
      if (indexClient > -1)
        this.clientCategories.splice(indexClient, 1);
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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['clientCategories']){
      const current = changes['clientCategories'].currentValue as ClientCategoryModel[];

      console.log(this.clientCategoryIds, this.clientCategories, current);

      if(this.clientCategoryIds.length < current.length)
        this.clientCategoryIds = current.map(category => category.id ?? 0);
    }
  }
}
