import {Component} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {TrainersService} from "../../../../services/trainers.service";
import {TrainerCreateRequestModel} from "../../../../models/trainers/trainer.create.request.model";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {FileModalComponent} from "../file.modal/file.modal.component";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {FileUploadService} from "../../../../services/file.upload.service";
import {CommonService} from "../../../../services/common.service";

@Component({
  selector: 'admin-trainers-create',
  templateUrl: 'trainers.create.component.html'
})
export class TrainersCreateComponent {
  constructor(private router: Router,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private trainerService: TrainersService,
              private fileUploadService: FileUploadService,
              private commonService: CommonService) {
  }

  trainer = this.trainerService.getTrainerCreateRequestModel();

  files: FileUploadModel[] = [];

  genderOptions = this.commonService.getGenderOptions();

  priceGradationOptions = this.commonService.getPriceGradationOptions();

  priceMask = this.commonService.getPriceMask();

  private modalRef?: BsModalRef;

  private readonly modalOptions: ModalOptions = {
    class: 'modal-dialog-centered modal-md'
  };

  addFile() {
    this.modalRef = this.modalService.show(FileModalComponent, this.modalOptions);

    this.modalRef.content.event.subscribe({
      next: (file: FileUploadModel) => {
        if (file) {
          file.url = this.commonService.restoreUrl(file.url);
          this.trainer.uploadedFileIds.push(file.id ?? 0);
          this.files.push(file);
        }
      }
    });
  }

  removeFile(fileId?: number) {
    if (!fileId) return;

    this.fileUploadService.remove(fileId).subscribe({
      next: data => this.toastr.success('файл удален', 'Загрузка файла')
    });
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
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
}
