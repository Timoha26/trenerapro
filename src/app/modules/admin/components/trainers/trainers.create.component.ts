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
import {LocationCreateModalComponent} from "../location/location.create.modal.component";
import {LocationCreateModel} from "../../../../models/locations/location.create.model";
import {LocationsService} from "../../../../services/locations.service";
import {LocationModel} from "../../../../models/locations/location.model";
import {ScheduleModel} from "../../../../models/schedule/schedule.model";
import {ScheduleService} from "../../../../services/schedule.service";
import {ScheduleUpdateModel} from "../../../../models/schedule/schedule.update.model";

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
              private commonService: CommonService,
              private locationsService: LocationsService,
              private scheduleService: ScheduleService) {
  }

  trainer = this.trainerService.getTrainerCreateRequestModel();

  schedule: ScheduleModel[] = this.scheduleService.getEmptyData();

  files: FileUploadModel[] = [];

  locations: LocationCreateModel[] = [];

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
      next: data => this.toastr.success('файл удален', 'Файлы')
    });
  }

  addLocation() {
    this.modalRef = this.modalService.show(LocationCreateModalComponent, this.modalOptions);

    this.modalRef.content.event.subscribe({
      next: (location: LocationCreateModel) => {
        if (location)
          this.locations.push(location);
      }
    });
  }

  removeLocation(location: LocationModel) {
    const index = this.locations.findIndex(item => item.address == location.address);

    if (index < 0) return;

    this.locations?.splice(index, 1);
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
        this.saveLocations(data.id ?? 0);
        this.saveSchedule(data.id ?? 0);
        this.toastr.success('тренер сохранен', 'Тренер');
        this.router.navigate(['/admin/trainers/' + data.id + '/edit']);
      }
    });
  }

  private saveLocations(trainerId: number) {
    if (this.locations.length == 0) return;

    this.locations.forEach(location => {
      location.trainerId = trainerId;

      this.locationsService.create(location).subscribe({
        next: data => {
          this.toastr.success('локация добавлена', 'Тренер');
        }
      });
    });
  }

  private saveSchedule(trainerId: number) {
    const updatedSchedule: ScheduleUpdateModel = {
      schedule: this.schedule
    };

    this.scheduleService.create(trainerId, updatedSchedule).subscribe({
      next: () => this.toastr.success('расписание сохранено', 'Тренер')
    });
  }
}
