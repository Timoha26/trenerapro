import {Component, Input} from "@angular/core";
import {SportsService} from "../../../../services/sports.service";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SportModel} from "../../../../models/sport.model";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {SportCreateModalComponent} from "./sport.create.modal.component";

@Component({
  selector: 'sports-select',
  templateUrl: 'sports.select.component.html',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true
})
export class SportsSelectComponent {
  @Input() sportIds: number[] = [];

  sports: SportModel[] = [];

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private sportsService: SportsService) {
  }

  checkboxChange(sportId: number | undefined, event: any) {
    if (sportId == undefined) return;

    if (event.target.checked) {
      this.sportIds.push(sportId);
    } else {
      const index = this.sportIds.indexOf(sportId);
      if (index > -1)
        this.sportIds.splice(index, 1);
    }
  }

  isChecked(sportId: number | undefined): boolean {
    return this.sportIds.includes(sportId ?? 0);
  }

  addSport() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(SportCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (sport: SportModel) => {
        if (sport)
          this.sports.push(sport);
      }
    });
  }

  private getSports() {
    this.sportsService.get().subscribe({next: data => this.sports = data});
  }

  ngOnInit() {
    this.getSports();
  }
}
