import {Component} from "@angular/core";
import {RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ReviewsService} from "../../services/reviews.service";
import {PageResultModel} from "../../models/page.result.model";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {ReviewModel} from "../../models/reviews/review.model";
import {RatingRepeatPipe} from "../../pipes/ratingRepeat.pipe";

@Component({
  selector: 'landing-reviews-home',
  templateUrl: './reviews.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    DatePipe,
    RatingRepeatPipe
  ]
})
export class ReviewsHomeComponent {
  constructor(private reviewsService: ReviewsService) {
  }

  public reviews: PageResultModel<ReviewModel> = {count: 0, items: []};

  private getReviews() {
    this.reviewsService.get().subscribe({
      next: data => {
        this.reviews = data;
      }
    });
  }

  ngOnInit() {
    this.getReviews();
  }
}
