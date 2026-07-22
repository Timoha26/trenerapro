import {Component} from "@angular/core";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ConfirmationModalComponent} from "../confirmation.modal/confirmation.modal.component";
import {PageResultModel} from "../../../../models/page.result.model";
import {TrainerModel} from "../../../../models/trainers/trainer.model";
import {TrainerFiltersModel} from "../../../../models/trainers/trainer.filters.model";
import {TrainersService} from "../../../../services/trainers.service";
import {SortByEnum} from "../../../../models/sortBy.enum";

@Component({
  selector: 'admin-trainers',
  templateUrl: 'trainers.component.html'
})
export class TrainersComponent {
  modalRef?: BsModalRef;
  trainers: PageResultModel<TrainerModel> = {items: [], count: 0};
  filters: TrainerFiltersModel = {
    offset: 0,
    limit: 10,
    sort: SortByEnum.Rating,
    desc: false,
    settlementIds: undefined,
    sportIds: undefined,
    clientCategoryIds: undefined,
    trainingFormatIds: undefined,
    verified: undefined,
    minRating: undefined,
    minPrice: undefined,
    maxPrice: undefined
  };

  constructor(private trainersService: TrainersService, private modalService: BsModalService) {
  }

  private getTrainers(filters: TrainerFiltersModel) {
    this.trainersService.get(filters).subscribe({next: data => this.trainers = data});
  }

  private setOffset(page: number, itemsPerPage: number) {
    this.filters.offset = (page - 1) * itemsPerPage;
    this.getTrainers(this.filters);
  }

  private searchAndUpdateTrainer(updatedTrainer: TrainerModel) {
    if (!this.trainers.items) return;

    for (let trainer of this.trainers.items)
      if (trainer.id == updatedTrainer.id) {
        trainer = updatedTrainer;
        break;
      }
  }

  setPage(event: PageChangedEvent) {
    this.setOffset(event.page, event.itemsPerPage);
  }

  // public(trainer: TrainerModel) {
  //   const confirmRemoveModalOptions: ModalOptions = {
  //     class: 'modal-dialog-centered modal-sm',
  //     initialState: {
  //       title: 'Вы уверены?',
  //       text: 'Тренер <b>' + trainer.firstname + ' ' + trainer.lastname + '</b> будет ' + (trainer.public ? 'снят с публикации' : 'опубликован')
  //     }
  //   };
  //
  //   this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);
  //
  //   this.modalRef.content.event.subscribe({
  //     next: (isConfirmed: boolean) => {
  //       if (isConfirmed) {
  //         trainer.public = !trainer.public;
  //
  //         this.trainersService.update(trainer).subscribe({
  //           next: data => {
  //             if (!this.trainers.items) return;
  //
  //             for (let i = 0; i < this.trainers.items.length; i++) {
  //               if (this.trainers.items[i].id === trainer.id) {
  //                 this.trainers.items[i] = data;
  //                 break;
  //               }
  //             }
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  verifiedToggle(trainer: TrainerModel, verified: boolean) {
    const confirmRemoveModalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        title: 'Вы уверены?',
        text: 'Для тренера <b>' + trainer.firstname + ' ' + trainer.lastname + '</b> будет ' + (!verified ? 'снят' : 'добавлен') + ' флаг &laquo;проверен&raquo;'
      }
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);

    this.modalRef.content.event.subscribe({
      next: (isConfirmed: boolean) => {
        if (isConfirmed) {
          trainer.verified = verified;

          if (verified)
            this.trainersService.approve(trainer.id ?? 0).subscribe({
              next: data => this.searchAndUpdateTrainer(trainer)
            });
          else
            this.trainersService.unapprove(trainer.id ?? 0).subscribe({
              next: data => this.searchAndUpdateTrainer(trainer)
            });
        }
      }
    });
  }

  remove(trainer: TrainerModel) {
    const confirmRemoveModalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        title: 'Вы уверены?',
        text: 'Тренер <b>' + trainer.firstname + ' ' + trainer.lastname + '</b> будет удален'
      }
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);

    this.modalRef.content.event.subscribe({
      next: (isConfirmed: boolean) => {
        if (isConfirmed)
          this.trainersService.remove(trainer.id ?? 0).subscribe({next: data => this.setOffset(1, 10)});
      }
    });
  }

  ngOnInit() {
    this.getTrainers(this.filters);
  }
}
