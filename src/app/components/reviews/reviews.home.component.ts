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
import {ReviewFiltersModel} from "../../models/reviews/review.filters.model";

@Component({
  selector: 'landing-reviews-home',
  templateUrl: './reviews.home.component.html',
  styleUrls: ['./reviews.home.component.scss'],
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
  reviews: PageResultModel<ReviewModel> = {count: 0, items: []};
  ratingMax = 5;
  private loading = false;
  private hasMore: boolean = true;
  private page: number = 1;
  private itemsPerPage: number = 5;

  ngOnInit() {
    this.getReviews();
  }

  onScroll(): void {
    const element = this.slider.nativeElement;
    const scrollRight = element.scrollLeft + element.clientWidth;
    const totalWidth = element.scrollWidth;
    const threshold = 300;

    if (totalWidth - scrollRight < threshold) {
      this.getReviews();
    }
  }

  private getReviews() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    const filters: ReviewFiltersModel = {
      offset: (this.page - 1) * this.itemsPerPage,
      limit: this.itemsPerPage
    };

    this.reviewsService.get(filters).subscribe({
      next: data => {
        if (data.items && data.items.length > 0) {
          data.items.forEach(review => {
            review.user = this.commonService.getFakeUser();
          });

          this.reviews.items = [...this.reviews.items ?? [], ...data.items];
          this.reviews.count = data.count;

          if (this.reviews.items.length >= (this.reviews.count ?? 0))
            this.hasMore = false;
          else
            this.page++;
        } else {
          this.hasMore = false;
        }

        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

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
}
