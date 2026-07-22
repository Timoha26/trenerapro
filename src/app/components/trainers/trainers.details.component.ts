import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {FileUploadModel} from "../../models/file.upload.model";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";

@Component({
  selector: 'landing-trainers-details',
  templateUrl: './trainers.details.component.html'
})
export class TrainersDetailsComponent {
  id: number | undefined;
  trainer: TrainerModel = {};
  private modalRef?: BsModalRef;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private trainerService: TrainersService,
              private commonService: CommonService,
              private modalService: BsModalService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  private getTrainer(id: number) {
    this.trainerService.getDetails(id).subscribe({
      next: data => {
        if (data.files) {
          data.files.forEach(file => {
            file.url = this.commonService.restoreUrl(file.url);

            if(this.commonService.isLogo(file))
              data.logoUrl = file.url;
          });
        }

        this.trainer = data;
      }
    });
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
  }

  addReview(trainerId?: number, clubId?: number) {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        trainerId: trainerId,
        clubId: clubId
      }
    };

    this.modalRef = this.modalService.show(ReviewCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (review: ReviewModel) => {
        console.log('review added');
      }
    });
  }

  ngOnInit() {
    if (this.id)
      this.getTrainer(this.id);
  }
}
