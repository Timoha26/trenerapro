import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ReviewsService} from "../../services/reviews.service";
import {PageResultModel} from "../../models/page.result.model";
import {ReviewModel} from "../../models/reviews/review.model";
import {RatingRepeatPipe} from "../../pipes/ratingRepeat.pipe";
import {RatingModule} from "ngx-bootstrap/rating";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'landing-reviews-home',
  templateUrl: './reviews.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    DatePipe,
    RatingRepeatPipe,
    RatingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReviewsHomeComponent implements OnInit {
  constructor(private reviewsService: ReviewsService,
              private commonService: CommonService) {
  }

  @ViewChild('slider', {read: ElementRef}) slider!: ElementRef<HTMLDivElement>;

  public reviews: PageResultModel<ReviewModel> = {count: 0, items: []};

  public ratingMax = 5;

  scrollSlider(direction: number): void {
    const element = this.slider.nativeElement;

    const firstItem = element.querySelector('.review-card') as HTMLElement;

    if(firstItem){
      const itemWidth = firstItem.clientWidth;
      const gup = 20;
      const scrollAmount = itemWidth + gup;

      element.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  private getReviews() {
    this.reviewsService.get().subscribe({
      next: data => {
        data.items?.forEach(review => {
          review.user = this.commonService.getFakeUser();
        });

        this.reviews = data;
      }
    });
  }

  ngOnInit() {
    this.getReviews();
  }
}
