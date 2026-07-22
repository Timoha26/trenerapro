import {Component} from "@angular/core";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ConfirmationModalComponent} from "../confirmation.modal/confirmation.modal.component";
import {PageResultModel} from "../../../../models/page.result.model";
import {TrainerFiltersModel} from "../../../../models/trainers/trainer.filters.model";
import {ClubModel} from "../../../../models/clubs/club.model";
import {ClubFiltersModel} from "../../../../models/clubs/club.filters.model";
import {ClubsService} from "../../../../services/clubs.service";
import {SortByEnum} from "../../../../models/sortBy.enum";

@Component({
  selector: 'admin-clubs',
  templateUrl: 'clubs.component.html'
})
export class ClubsComponent {
  modalRef?: BsModalRef;
  clubs: PageResultModel<ClubModel> = {items: [], count: 0};
  filters: ClubFiltersModel = {
    offset: 0,
    limit: 10,
    sort: SortByEnum.Rating,
    desc: false,
    settlementIds: undefined,
    sportIds: undefined,
    verified: undefined,
    minRating: undefined
  };

  constructor(private clubsService: ClubsService, private modalService: BsModalService) {
  }

  private getClubs(filters: TrainerFiltersModel) {
    this.clubsService.get(filters).subscribe({next: data => this.clubs = data});
  }

  private setOffset(page: number, itemsPerPage: number) {
    this.filters.offset = (page - 1) * itemsPerPage;
    this.getClubs(this.filters);
  }

  private searchAndUpdateClub(updatedClub: ClubModel) {
    if (!this.clubs.items) return;

    for (let club of this.clubs.items)
      if (club.id == updatedClub.id) {
        club = updatedClub;
        break;
      }
  }

  setPage(event: PageChangedEvent) {
    this.setOffset(event.page, event.itemsPerPage);
  }

  // public(club: ClubModel) {
  //   const confirmRemoveModalOptions: ModalOptions = {
  //     class: 'modal-dialog-centered modal-sm',
  //     initialState: {
  //       title: 'Вы уверены?',
  //       text: 'Клуб <b>' + club.name + '</b> будет ' + (club.public ? 'снят с публикации' : 'опубликован')
  //     }
  //   };
  //
  //   this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);
  //
  //   this.modalRef.content.event.subscribe({
  //     next: (isConfirmed: boolean) => {
  //       if (isConfirmed) {
  //         club.public = !club.public;
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

  verifiedToggle(club: ClubModel, verified: boolean) {
    const confirmRemoveModalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        title: 'Вы уверены?',
        text: 'Для клуба <b>' + club.name + '</b> будет ' + (!verified ? 'снят' : 'добавлен') + ' флаг &laquo;проверен&raquo;'
      }
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);

    this.modalRef.content.event.subscribe({
      next: (isConfirmed: boolean) => {
        if (isConfirmed) {
          club.verified = verified;

          if (verified)
            this.clubsService.approve(club.id ?? 0).subscribe({
              next: data => this.searchAndUpdateClub(club)
            });
          else
            this.clubsService.unapprove(club.id ?? 0).subscribe({
              next: data => this.searchAndUpdateClub(club)
            });
        }
      }
    });
  }

  remove(club: ClubModel) {
    const confirmRemoveModalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        title: 'Вы уверены?',
        text: 'Клуб <b>' + club.name + '</b> будет удален'
      }
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, confirmRemoveModalOptions);

    this.modalRef.content.event.subscribe({
      next: (isConfirmed: boolean) => {
        if (isConfirmed)
          this.clubsService.remove(club.id ?? 0).subscribe({next: data => this.setOffset(1, 10)});
      }
    });
  }

  ngOnInit() {
    this.getClubs(this.filters);
  }
}
