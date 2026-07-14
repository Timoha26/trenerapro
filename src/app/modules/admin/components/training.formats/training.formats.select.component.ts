import {Component, Input} from "@angular/core";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {TrainingFormatsCreateModalComponent} from "./training.formats.create.modal.component";
import {TrainingFormatsService} from "../../../../services/training.formats.service";
import {TrainingFormatModel} from "../../../../models/training.format.model";

@Component({
  selector: 'training-formats-select',
  templateUrl: 'training.formats.select.component.html',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true
})
export class TrainingFormatsSelectComponent {
  @Input() trainingFormatIds: number[] = [];

  formats: TrainingFormatModel[] = [];

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private trainingFormatsService: TrainingFormatsService) {
  }

  checkboxChange(formatId: number | undefined, event: any) {
    if (formatId == undefined) return;

    if (event.target.checked) {
      this.trainingFormatIds.push(formatId);
    } else {
      const index = this.trainingFormatIds.indexOf(formatId);
      if (index > -1)
        this.trainingFormatIds.splice(index, 1);
    }
  }

  isChecked(formatId: number | undefined): boolean {
    return this.trainingFormatIds.includes(formatId ?? 0);
  }

  addFormat() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(TrainingFormatsCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (format: TrainingFormatModel) => {
        if (format)
          this.formats.push(format);
      }
    });
  }

  private getFormats() {
    this.trainingFormatsService.get().subscribe({next: data => this.formats = data});
  }

  ngOnInit() {
    this.getFormats();
  }
}
