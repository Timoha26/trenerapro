import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TrainersService} from "../../services/trainers.service";
import {RestoreUrlService} from "../../services/restore.url.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {FileTypeEnum} from "../../models/file.type.enum";
import {FileUploadModel} from "../../models/file.upload.model";

@Component({
  selector: 'landing-trainers-details',
  templateUrl: './trainers.details.component.html'
})
export class TrainersDetailsComponent {
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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private trainerService: TrainersService, private restoreUrlService: RestoreUrlService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getTrainer(id: number) {
    this.trainerService.getDetails(id).subscribe({
      next: data => {
        if (data.files) {
          data.files.forEach(file => {
            file.url = this.restoreUrlService.restoreUrl(file.url);

            if(file.type == FileTypeEnum.Avatar || file.type == FileTypeEnum.Photo)
              data.logoUrl = file.url;
          });
        }

        this.trainer = data;
      }
    });
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

  ngOnInit() {
    if (this.id)
      this.getTrainer(this.id);
  }
}
