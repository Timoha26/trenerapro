import {Component, EventEmitter} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {TrainingFormatModel} from "../../../../models/training.format.model";
import {TrainingFormatsService} from "../../../../services/training.formats.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'sport-create-modal',
  templateUrl: 'training.formats.create.modal.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class TrainingFormatsCreateModalComponent {
  event: EventEmitter<TrainingFormatModel> = new EventEmitter<TrainingFormatModel>();

  newFormat: TrainingFormatModel = {
    name: undefined,
    slug: undefined
  };

  constructor(private modalRef: BsModalRef, private toastr: ToastrService, private trainingFormatsService: TrainingFormatsService) {
  }

  save() {
    this.trainingFormatsService.create(this.newFormat).subscribe({
      next: (data: TrainingFormatModel) => {
        this.event.emit(data);
        this.toastr.success('Формат создан', 'Формат занятий');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Формат занятий');
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
