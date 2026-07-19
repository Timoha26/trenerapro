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
import {RestoreUrlService} from "../../../../services/restore.url.service";
import {FileModalComponent} from "../file.modal/file.modal.component";
import {FileTypeEnum} from "../../../../models/file.type.enum";
import {TrainerCreateRequestModel} from "../../../../models/trainers/trainer.create.request.model";
import {SettlementModel} from "../../../../models/settlement.model";
import {ClubModel} from "../../../../models/clubs/club.model";
import {TrainerLevelEnum} from "../../../../models/trainers/trainer.level.enum";
import {RatingModel} from "../../../../models/rating.model";
import {SportModel} from "../../../../models/sport.model";
import {TrainingFormatModel} from "../../../../models/training.format.model";
import {ClientCategoryModel} from "../../../../models/client.category.model";
import {CommonService} from "../../../../services/common.service";
import {FileUploadService} from "../../../../services/file.upload.service";
import {ClubCreateModel} from "../../../../models/clubs/club.create.model";
import {TrainerCreateModel} from "../../../../models/trainers/trainer.create.model";

@Component({
  selector: 'admin-trainers-edit',
  templateUrl: 'trainers.edit.component.html'
})
export class TrainersEditComponent {
  id: number | undefined;
  trainer: TrainerModel = {};

  files: FileUploadModel[] = [];

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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private trainerService: TrainersService,
              private restoreUrlService: RestoreUrlService,
              private commonService: CommonService,
              private fileUploadService: FileUploadService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getTrainer(id: number) {
    this.trainerService.getDetails(id).subscribe({
      next: data => {
        if(data.files) {
          data.files.forEach(file => {
            file.url = this.restoreUrlService.restoreUrl(file.url);
          });
        }

        this.trainer = data;
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
          file.url = this.restoreUrlService.restoreUrl(file.url);

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

        this.toastr.success('файл удален', 'Загрузка файла');
      }
    });
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
  }

  private updateTrainer() {
    const trainer: TrainerCreateModel = {
      firstname: this.trainer.firstname,
      lastname: this.trainer.lastname,
      patronymic: this.trainer.patronymic,
      age: this.trainer.age,
      experience: this.trainer.experience,
      gender: this.trainer.gender,
      price: this.trainer.price,
      priceGradation: this.trainer.priceGradation,
      description: this.trainer.description,
      settlementId: this.trainer.settlementId
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
        next: () => this.toastr.success('тренер сохранен', 'Клубы')
      });
  }

  ngOnInit() {
    if (this.id)
      this.getTrainer(this.id);
  }
}
