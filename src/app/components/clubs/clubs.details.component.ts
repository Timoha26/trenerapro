import {Component, computed, OnInit, signal} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploadModel} from "../../models/file.upload.model";
import {ClubModel} from "../../models/clubs/club.model";
import {ClubsService} from "../../services/clubs.service";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";
import {PageStateEvent} from "../../models/page.state.event";

@Component({
  selector: 'landing-clubs-details',
  templateUrl: './clubs.details.component.html'
})
export class ClubsDetailsComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
              private clubsService: ClubsService,
              private commonService: CommonService,
              private modalService: BsModalService) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  id: number | undefined;
  club: ClubModel = {};
  private modalRef?: BsModalRef;
  ratingMax = 5;
  allReviews = signal<ReviewModel[]>([]);
  reviewFilters = signal<any>({
    offset: 0,
    limit: 3
  });

  private getClub(id: number) {
    this.clubsService.getDetails(id).subscribe({
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

        this.club = data;
      }
    });
  }

  isImage(file: FileUploadModel) {
    return this.commonService.isImage(file);
  }

  isNotImage(file: FileUploadModel) {
    return this.commonService.isNotImage(file);
  }

  addReview(event: Event, clubId?: number) {
    event.preventDefault();

    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        clubId: clubId
      }
    };

    this.modalRef = this.modalService.show(ReviewCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (review: ReviewModel) => {
        review.user = this.commonService.getFakeUser();
        this.club.reviews?.push(review);
        this.allReviews.set(this.club.reviews ?? []);
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
      this.getClub(this.id);
  }
}
