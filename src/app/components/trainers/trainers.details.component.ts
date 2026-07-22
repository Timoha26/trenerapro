import {Component, computed, ElementRef, OnInit, signal, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {FileUploadModel} from "../../models/file.upload.model";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";
import {PageStateEvent} from "../../models/page.state.event";
import {th} from "@faker-js/faker";

@Component({
  selector: 'landing-trainers-details',
  templateUrl: './trainers.details.component.html'
})
export class TrainersDetailsComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
              private trainerService: TrainersService,
              private commonService: CommonService,
              private modalService: BsModalService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  id: number | undefined;
  trainer: TrainerModel = {};
  ratingMax = 5;
  private modalRef?: BsModalRef;
  allReviews = signal<ReviewModel[]>([]);
  reviewFilters = signal<any>({
    offset: 0,
    limit: 3
  });

  private getTrainer(id: number) {
    this.trainerService.getDetails(id).subscribe({
      next: data => {
        if (data.files)
          data.files.forEach(file => {
            file.url = this.commonService.restoreUrl(file.url);

            if (this.commonService.isLogo(file))
              data.logoUrl = file.url;
          });

        if (data.reviews) {
          data.reviews?.forEach(review => {
            review.user = this.commonService.getFakeUser();
          });

          this.allReviews.set(data.reviews);
          this.onPageChange({page: 1, itemsPerPage: this.reviewFilters().limit});
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

  addReview(event: Event, trainerId?: number) {
    event.preventDefault();

    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        trainerId: trainerId
      }
    };

    this.modalRef = this.modalService.show(ReviewCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (review: ReviewModel) => {
        review.user = this.commonService.getFakeUser();
        this.trainer.reviews?.push(review);
        this.allReviews.set(this.trainer.reviews ?? []);
      }
    });
  }

  onPageChange(event: PageStateEvent): void {
    this.reviewFilters.update(prev => ({
      ...prev,
      offset: (event.page - 1) * event.itemsPerPage
    }));
  }

  reviews = computed(() => {
    const filters = this.reviewFilters();
    return this.allReviews().slice(filters.offset, filters.offset + filters.limit);
  });

  ngOnInit() {
    if (this.id)
      this.getTrainer(this.id);
  }
}
