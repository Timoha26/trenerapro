import {Component, EventEmitter, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ReviewModel} from "../../models/reviews/review.model";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {ReviewsService} from "../../services/reviews.service";
import {ReviewCreateModel} from "../../models/reviews/review.create.model";
import {NgClass} from "@angular/common";
import {RatingModule} from "ngx-bootstrap/rating";

@Component({
  selector: 'review-create-modal',
  templateUrl: './review.create.modal.component.html',
  styleUrls: ['./review.create.modal.component.scss'],
  imports: [
    FormsModule,
    NgClass,
    RatingModule
  ],
  standalone: true
})
export class ReviewCreateModalComponent implements OnInit {
  constructor(private modalRef: BsModalRef,
              private toastr: ToastrService,
              private reviewsService: ReviewsService) {
  }

  trainerId?: number = undefined;

  clubId?: number = undefined;

  event: EventEmitter<ReviewModel> = new EventEmitter<ReviewModel>();

  newReview: ReviewCreateModel = {
    text: undefined,
    rating: undefined,
    trainerId: this.trainerId,
    clubId: this.clubId
  };

  entityRating?: string;
  entityText?: string;

  readonly ratingMax: number = 5;

  ngOnInit() {
    if (this.trainerId && !this.clubId) {
      this.entityRating = ' тренера';
      this.entityText = ' о тренере';
    }

    if (this.clubId && !this.trainerId) {
      this.entityRating = ' клуб';
      this.entityText = ' о клубе';
    }

    if (this.trainerId && this.clubId) {
      this.entityRating = ' тренера и клуб';
      this.entityText = ' о тренере и клубе';
    }

    this.newReview = {
      text: undefined,
      rating: 0,
      trainerId: this.trainerId,
      clubId: this.clubId
    };
  }

  save() {
    console.log(this.newReview);
    this.reviewsService.create(this.newReview).subscribe({
      next: (data: ReviewModel) => {
        this.event.emit(data);
        this.toastr.success('Спасибо за отзыв!', 'Новый отзыв');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Новый отзыв');
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
