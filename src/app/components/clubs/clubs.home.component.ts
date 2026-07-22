import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {ClubsService} from "../../services/clubs.service";
import {ClubModel} from "../../models/clubs/club.model";
import {SportsListenerPipe} from "../../pipes/sportsListener.pipe";
import {BehaviorSubject, Subscription, switchMap} from "rxjs";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";

@Component({
  selector: 'landing-clubs-home',
  templateUrl: './clubs.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    SportsListenerPipe
  ]
})
export class ClubsHomeComponent implements OnInit, OnDestroy {
  public clubs: ClubModel[] = [];
  private limit: number = 4;
  private paramSource$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private subscription!: Subscription;
  private modalRef?: BsModalRef;

  @Input() set filterParam(value: number | undefined) {
    this.paramSource$.next(value);
  }

  constructor(private clubsService: ClubsService,
              private commonService: CommonService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.subscription = this.paramSource$.pipe(
      switchMap((param) => this.clubsService.getTop(this.limit, param))
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
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
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
}
