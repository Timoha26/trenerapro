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

@Component({
  selector: 'admin-projects-edit',
  templateUrl: 'trainers.edit.component.html'
})
export class TrainersEditComponent {
  id: number | undefined;
  trainer: TrainerModel = {
    id: undefined,
    settlement: undefined,
    firstname: undefined,
    lastname: undefined,
    patronymic: undefined,
    age: undefined,
    experience: undefined,
    gender: undefined,
    price: undefined,
    priceGradation: undefined,
    description: undefined,
    club: undefined,
    verified: undefined,
    level: undefined,
    logoUrl: undefined,
    sports: undefined,
    rating: undefined,
    trainingFormats: undefined,
    files: undefined,
    clientCategories: undefined,
    lessonAddresses: undefined,
    public: undefined
  };

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: BsModalService, private toastr: ToastrService, private trainerService: TrainersService, private restoreUrlService: RestoreUrlService) {
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
    // const modalOptions: ModalOptions = {
    //   class: 'modal-dialog-centered modal-md'
    // };
    //
    // this.modalRef = this.modalService.show(FileModalComponent, modalOptions);
    //
    // this.modalRef.content.event.subscribe({
    //   next: (file: FileUploadModel) => {
    //     if (file) {
    //       file.url = this.restoreUrlService.restoreUrl(file.url);
    //       this.trainer.uploadedFileIds.push(file.id ?? 0);
    //       this.files.push(file);
    //     }
    //   }
    // });
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
    // let trainer: TrainerCreateRequestModel = JSON.parse(JSON.stringify(this.trainer));
    //
    // if (trainer.createTrainer?.price)
    //   trainer.createTrainer.price = parseFloat(trainer.createTrainer.price.toString().replace(/[^0-9.]/g, ''));
    //
    // this.trainerService.create(trainer).subscribe({
    //   next: data => {
    //     this.toastr.success('тренер сохранен', 'Тренер');
    //     this.router.navigate(['/admin/trainers/' + data.id + '/edit']);
    //   }
    // });
  }

  ngOnInit() {
    if (this.id)
      this.getTrainer(this.id);
  }
}
