import {Component} from "@angular/core";
import {createMask} from "@ngneat/input-mask";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {TrainersService} from "../../../../services/trainers.service";
import {TrainerCreateRequestModel} from "../../../../models/trainers/trainer.create.request.model";
import {PriceGradationEnum} from "../../../../models/trainers/price.gradation.enum";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {FileModalComponent} from "../file.modal/file.modal.component";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {FileTypeEnum} from "../../../../models/file.type.enum";
import {RestoreUrlService} from "../../../../services/restore.url.service";

@Component({
  selector: 'admin-projects-create',
  templateUrl: 'trainers.create.component.html'
})
export class TrainersCreateComponent {
  trainer: TrainerCreateRequestModel = {
    createTrainer: {
      firstname: undefined,
      lastname: undefined,
      patronymic: undefined,
      age: undefined,
      experience: undefined,
      gender: undefined,
      price: undefined,
      priceGradation: undefined,
      description: undefined
    },
    settlementId: undefined,
    sportIds: [],
    trainingFormatIds: [],
    clientCategoryIds: [],
    uploadedFileIds: []
  };

  files: FileUploadModel[] = [];

  priceGradationOptions = [
    {key: PriceGradationEnum.Lesson, name: "Занятие"},
    {key: PriceGradationEnum.Day, name: "День"},
    {key: PriceGradationEnum.Week, name: "Неделя"},
    {key: PriceGradationEnum.Month, name: "Месяц"}
  ];

  priceMask = createMask({
    alias: 'currency',
    rightAlign: false,
    suffix: ' ₽',
    unmaskAsNumber: true
  });

  private modalRef?: BsModalRef;

  constructor(private router: Router, private modalService: BsModalService, private toastr: ToastrService, private trainerService: TrainersService, private restoreUrlService: RestoreUrlService) {
  }

  addFile() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(FileModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (file: FileUploadModel) => {
        if (file) {
          file.url = this.restoreUrlService.restoreUrl(file.url);
          this.trainer.uploadedFileIds.push(file.id ?? 0);
          this.files.push(file);
        }

        console.log(this.trainer.uploadedFileIds);
      }
    });
  }

  removeFile(fileId?: number) {
    console.log('removing file');
  }

  isImage(file: FileUploadModel) {
    if (file.type === undefined) return false;

    const type = file.type as FileTypeEnum;

    return type == FileTypeEnum.Avatar || type == FileTypeEnum.Logo || type == FileTypeEnum.Photo;
  }

  isNotImage(file: FileUploadModel) {
    if (file.type === undefined) return false;

    const type = file.type as FileTypeEnum;

    return type == FileTypeEnum.Video || type == FileTypeEnum.Document;
  }

  save() {
    let trainer: TrainerCreateRequestModel = JSON.parse(JSON.stringify(this.trainer));

    if (trainer.createTrainer?.price)
      trainer.createTrainer.price = parseFloat(trainer.createTrainer.price.toString().replace(/[^0-9.]/g, ''));

    this.trainerService.create(trainer).subscribe({
      next: data => {
        this.toastr.success('тренер сохранен', 'Тренер');
        this.router.navigate(['/admin/trainers/' + data.id + '/edit']);
      }
    });
  }

  protected readonly FileTypeEnum = FileTypeEnum;
}
