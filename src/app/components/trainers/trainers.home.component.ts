import {Component, ElementRef, ViewChild} from "@angular/core";
import {RouterLink} from "@angular/router";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {distinctUntilChanged, switchMap} from "rxjs";
import {CategoriesListenerPipe} from "../../pipes/categoriesListener.pipe";
import {PriceGradationPipe} from "../../pipes/priceGradation.pipe";
import {ReviewsPipe} from "../../pipes/reviews.pipe";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";
import {toObservable} from "@angular/core/rxjs-interop";
import {RatingModule} from "ngx-bootstrap/rating";
import {PageResultModel} from "../../models/page.result.model";

@Component({
  selector: 'landing-trainers-home',
  templateUrl: './trainers.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    CurrencyPipe,
    CategoriesListenerPipe,
    PriceGradationPipe,
    ReviewsPipe,
    DatePipe,
    RatingModule
  ]
})
export class TrainersHomeComponent {
  @ViewChild('slider', {read: ElementRef}) slider!: ElementRef<HTMLDivElement>;
  public trainers: TrainerModel[] = [];
  private page: number = 1;
  private itemsPerPage: number = 5;


  private modalRef?: BsModalRef;

  constructor(private trainersService: TrainersService,
              private commonService: CommonService,
              private modalService: BsModalService) {
  }

  private dataSubscription = toObservable(this.commonService.globalFilters).pipe(
    distinctUntilChanged(),
    switchMap((param) => this.trainersService.getRandom(param))
  ).subscribe({
    next: data => {
      let items = data ?? [];

      items?.forEach(item =>
        item.files?.forEach(file => {
          file.url = this.commonService.restoreUrl(file.url);

          if (this.commonService.isLogo(file))
            item.logoUrl = file.url;
        })
      );

      this.trainers = items;
    }
  });

  onScroll(): void {
    const element = this.slider.nativeElement;
    const scrollRight = element.scrollLeft + element.clientWidth;
    const totalWidth = element.scrollWidth;
    const threshold = 300;

    // if (totalWidth - scrollRight < threshold) {
    //   this.getReviews();
    // }
  }

  scrollSlider(direction: number): void {
    const element = this.slider.nativeElement;

    const firstItem = element.querySelector('.card') as HTMLElement;

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

  addReview(trainerId?: number) {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        trainerId: trainerId
      }
    };

    this.modalRef = this.modalService.show(ReviewCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (review: ReviewModel) => {
        console.log('review added');
      }
    });
  }
}
