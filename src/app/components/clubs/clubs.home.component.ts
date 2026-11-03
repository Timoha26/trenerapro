import {Component, ElementRef, ViewChild} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {ClubsService} from "../../services/clubs.service";
import {ClubModel} from "../../models/clubs/club.model";
import {CategoriesListenerPipe} from "../../pipes/categoriesListener.pipe";
import {distinctUntilChanged, switchMap} from "rxjs";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'landing-clubs-home',
  templateUrl: './clubs.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    CategoriesListenerPipe
  ]
})
export class ClubsHomeComponent {
  @ViewChild('slider', {read: ElementRef}) slider!: ElementRef<HTMLDivElement>;
  public clubs: ClubModel[] = [];
  private modalRef?: BsModalRef;

  constructor(private clubsService: ClubsService,
              private commonService: CommonService,
              private modalService: BsModalService) {
  }

  private dataSubscription = toObservable(this.commonService.globalFilters).pipe(
    distinctUntilChanged(),
    switchMap((param) => this.clubsService.getTop(param))
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

      this.clubs = items;
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

  addReview(clubId?: number) {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
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
}
