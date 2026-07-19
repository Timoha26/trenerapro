import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {TrainingFormatsCreateModalComponent} from "./training.formats.create.modal.component";
import {TrainingFormatsService} from "../../../../services/training.formats.service";
import {TrainingFormatModel} from "../../../../models/training.format.model";
import {CommonService} from "../../../../services/common.service";

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
export class TrainingFormatsSelectComponent implements OnInit, OnChanges {
  @Input() trainingFormatIds: number[] = [];
  @Input() trainingFormats: TrainingFormatModel[] = [];

  formats: TrainingFormatModel[] = [];

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService,
              private trainingFormatsService: TrainingFormatsService,
              private commonService: CommonService) {
  }

  checkboxChange(format: TrainingFormatModel | undefined, event: any) {
    if (format?.id == undefined) return;

    if (event.target.checked) {
      this.trainingFormatIds.push(format.id);
      this.trainingFormats.push(format);
    } else {
      const indexId = this.trainingFormatIds.indexOf(format.id);
      if (indexId > -1)
        this.trainingFormatIds.splice(indexId, 1);

      const indexFormat = this.commonService.getIndexInArrayById(format.id, this.trainingFormats);
      if (indexFormat > -1)
        this.trainingFormats.splice(indexFormat, 1);
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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['trainingFormats']){
      const current = changes['trainingFormats'].currentValue as TrainingFormatModel[];

      console.log(this.trainingFormatIds, this.trainingFormats, current);

      if(this.trainingFormatIds.length < current.length)
        this.trainingFormatIds = current.map(format => format.id ?? 0);
    }
  }
}
