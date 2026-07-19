import {Component, EventEmitter} from "@angular/core";
import {SportModel} from "../../../../models/sport.model";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {SportsService} from "../../../../services/sports.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'sport-create-modal',
  templateUrl: 'sport.create.modal.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class SportCreateModalComponent {
  event: EventEmitter<SportModel> = new EventEmitter<SportModel>();

  newSport: SportModel = {
    name: undefined,
    icon: undefined
  };

  constructor(private modalRef: BsModalRef, private toastr: ToastrService, private sportsService: SportsService) {
  }

  save() {
    this.sportsService.create(this.newSport).subscribe({
      next: (data: SportModel) => {
        this.event.emit(data);
        this.toastr.success('Дисциплина создана', 'Спортивная дисциплина');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Спортивная дисциплина');
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
