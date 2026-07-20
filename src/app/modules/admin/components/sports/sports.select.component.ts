import {Component, Input, SimpleChanges} from "@angular/core";
import {SportsService} from "../../../../services/sports.service";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SportModel} from "../../../../models/sport.model";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {SportCreateModalComponent} from "./sport.create.modal.component";
import {CommonService} from "../../../../services/common.service";

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
  @Input() sports: SportModel[] = [];

  allSports: SportModel[] = [];

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private sportsService: SportsService, private commonService: CommonService) {
  }

  checkboxChange(sport: SportModel | undefined, event: any) {
    if (sport?.id == undefined) return;

    if (event.target.checked) {
      this.sportIds.push(sport.id);
      this.sports.push(sport)
    } else {
      const IdIndex = this.sportIds.indexOf(sport.id);
      if (IdIndex > -1)
        this.sportIds.splice(IdIndex, 1);

      const sportIndex = this.commonService.getIndexInArrayById(sport.id, this.sports);
      if(sportIndex > -1)
        this.sports.splice(sportIndex, 1);
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
    this.sportsService.get().subscribe({next: data => this.allSports = data});
  }

  ngOnInit() {
    this.getSports();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['sports']){
      const current = changes['sports'].currentValue as SportModel[];

      console.log(this.sportIds, this.sports, current);

      if(this.sportIds.length < current.length)
        this.sportIds = current.map(sport => sport.id ?? 0);
    }
  }
}
