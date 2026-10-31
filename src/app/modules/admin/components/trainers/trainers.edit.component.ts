import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {createMask} from "@ngneat/input-mask";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {TrainerModel} from "../../../../models/trainers/trainer.model";
import {TrainersService} from "../../../../services/trainers.service";
import {FileUploadModel} from "../../../../models/file.upload.model";
import {GenderEnum} from "../../../../models/trainers/gender.enum";
import {PriceGradationEnum} from "../../../../models/trainers/price.gradation.enum";
import {FileModalComponent} from "../file.modal/file.modal.component";
import {CommonService} from "../../../../services/common.service";
import {FileUploadService} from "../../../../services/file.upload.service";
import {TrainerCreateModel} from "../../../../models/trainers/trainer.create.model";
import {LocationCreateModalComponent} from "../location/location.create.modal.component";
import {LocationCreateModel} from "../../../../models/locations/location.create.model";
import {LocationsService} from "../../../../services/locations.service";
import {LocationModel} from "../../../../models/locations/location.model";
import {ScheduleService} from "../../../../services/schedule.service";
import {ScheduleModel} from "../../../../models/schedule/schedule.model";
import {ScheduleUpdateModel} from "../../../../models/schedule/schedule.update.model";

@Component({
  selector: 'admin-trainers-edit',
  templateUrl: 'trainers.edit.component.html'
})
export class TrainersEditComponent {
  id: number | undefined;
  trainer: TrainerModel = {};

  files: FileUploadModel[] = [];

  schedule: ScheduleModel[] = this.scheduleService.getEmptyData();

  private scheduleIsNotFound: boolean = false;

  genderOptions = [
    {key: GenderEnum.Male, name: "Мужщина"},
    {key: GenderEnum.Female, name: "Женщина"}
  ];

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
  private deleteLocations: number[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private trainerService: TrainersService,
              private commonService: CommonService,
              private fileUploadService: FileUploadService,
              private locationsService: LocationsService,
              private scheduleService: ScheduleService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getTrainer(id: number) {
    this.trainerService.getDetails(id).subscribe({
      next: data => {
        if (data.files) {
          data.files.forEach(file => {
            file.url = this.commonService.restoreUrl(file.url);
          });
        }

        this.trainer = data;
      }
    });
  }

  private getSchedule(trainerId: number) {
    this.scheduleService.get(trainerId).subscribe({
      next: data => {
        if(data.schedule)
          this.schedule = data.schedule;

        this.scheduleIsNotFound = false;
      },
      error: err => {
        if(err.status === 404)
          this.scheduleIsNotFound = true;

        this.scheduleIsNotFound = false;
      }
    });
  }

  addFile() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        trainerId: this.trainer.id
      }
    };

    this.modalRef = this.modalService.show(FileModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (file: FileUploadModel) => {
        if (file) {
          file.url = this.commonService.restoreUrl(file.url);

          if (!this.trainer.files)
            this.trainer.files = [];

          this.trainer.files.push(file);
        }
      }
    });
  }

  removeFile(fileId?: number) {
    if (!fileId) return;

    this.fileUploadService.remove(fileId).subscribe({
      next: data => {
        if (!this.trainer.files)
          this.trainer.files = [];

        let index = this.commonService.getIndexInArrayById(fileId, this.trainer.files);
        if (index > -1)
          this.trainer.files.splice(index, 1);

        this.toastr.success('файл удален', 'Файлы');
      }
    });
  }

  addLocation() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(LocationCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (location: LocationCreateModel) => {
        if (location)
          this.trainer.locations?.push(location);
      }
    });
  }

  removeLocation(location: LocationModel) {
    const index = this.trainer.locations?.findIndex(item => item.address == location.address) ?? -1;

    if (index < 0) return;

    this.trainer.locations?.splice(index, 1);

    if (!location.id) return;

    this.deleteLocations.push(location.id);
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
  }

  save() {
    this.updateTrainer();
    this.updateSports();
    this.updateTrainingFormats();
    this.updateClientCategories();
    this.updateLocations();
    this.updateSchedule();
  }

  private updateTrainer() {
    const trainer: TrainerCreateModel = {
      firstname: this.trainer.firstname,
      lastname: this.trainer.lastname,
      patronymic: this.trainer.patronymic,
      age: this.trainer.age,
      experience: this.trainer.experience,
      trainingExperience: this.trainer.trainingExperience,
      gender: this.trainer.gender,
      price: this.trainer.price,
      priceGradation: this.trainer.priceGradation,
      description: this.trainer.description,
      education: this.trainer.education,
      area: this.trainer.area,
      specialization: this.trainer.specialization
    };

    this.trainerService.update(this.trainer.id, trainer).subscribe({
      next: () => {
        this.toastr.success('тренер сохранен', 'Тренер');
        this.router.navigate(['/admin/trainers']);
      }
    });
  }

  private updateSports() {
    if (!this.trainer.id || !this.trainer.sports) return;

    const sportIds = this.trainer.sports.map(sport => sport.id ?? 0);

    this.trainerService.updateRelationsSports(this.trainer.id ?? 0, sportIds)
      .subscribe({
        next: () => this.toastr.success('категории обновлены', 'Тренер')
      });
  }

  private updateTrainingFormats() {
    if (!this.trainer.id || !this.trainer.trainingFormats || this.trainer.trainingFormats?.length == 0) return;

    this.trainerService.updateTrainingFormats(this.trainer.id, this.trainer.trainingFormats.map(format => format.id ?? 0))
      .subscribe({
        next: data => this.toastr.success('формат занятий обновлен', 'Тренер')
      });
  }

  private updateClientCategories() {
    if (!this.trainer.id || !this.trainer.clientCategories || this.trainer.clientCategories.length == 0) return;

    this.trainerService.updateClientCategories(this.trainer.id, this.trainer.clientCategories.map(format => format.id ?? 0))
      .subscribe({
        next: data => this.toastr.success('кого тренирует обновлено', 'Тренер')
      });
  }

  private updateLocations() {
    if (!this.trainer.locations || this.trainer.locations.length == 0) return;

    const newLocations = this.trainer.locations.filter(location => !location.id);

    newLocations.forEach(location => {
      location.trainerId = this.trainer.id;

      this.locationsService.create(location).subscribe({
        next: data => {
          this.toastr.success('локация добавлена', 'Тренер');
        }
      });
    });

    this.deleteLocations.forEach(locationId => {
      this.locationsService.remove(locationId).subscribe({
        next: () => {
          this.toastr.success('локация удалена', 'Тренер');
        }
      });
    });
  }

  private updateSchedule(){
    const updatedSchedule: ScheduleUpdateModel = {
      schedule: this.schedule
    };

    if(this.scheduleIsNotFound)
      this.scheduleService.create(this.id ?? 0, updatedSchedule).subscribe({
        next: () => this.toastr.success('расписание сохранено', 'Тренер')
      });
    else
      this.scheduleService.update(this.id ?? 0, updatedSchedule).subscribe({
        next: () => this.toastr.success('расписание сохранено', 'Тренер')
      });
  }

  ngOnInit() {
    if (this.id) {
      this.getTrainer(this.id);
      this.getSchedule(this.id);
    }
  }
}
