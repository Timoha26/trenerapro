import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {BehaviorSubject, Subscription, switchMap} from "rxjs";
import {SportsListenerPipe} from "../../pipes/sportsListener.pipe";
import {PriceGradationPipe} from "../../pipes/priceGradation.pipe";
import {ReviewsPipe} from "../../pipes/reviews.pipe";
import {CommonService} from "../../services/common.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";

@Component({
  selector: 'landing-trainers-home',
  templateUrl: './trainers.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    CurrencyPipe,
    SportsListenerPipe,
    PriceGradationPipe,
    ReviewsPipe
  ]
})
export class TrainersHomeComponent implements OnInit, OnDestroy {
  public trainers: TrainerModel[] = [];
  private limit: number = 4;
  private paramSource$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private subscription!: Subscription;
  private modalRef?: BsModalRef;

  @Input() set filterParam(value: number | undefined) {
    this.paramSource$.next(value);
  }

  constructor(private trainersService: TrainersService,
              private commonService: CommonService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.subscription = this.paramSource$.pipe(
      switchMap((param) => this.trainersService.getTop(this.limit, param))
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
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
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
