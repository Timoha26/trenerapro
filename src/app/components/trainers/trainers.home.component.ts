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

  @Input() set filterParam(value: number | undefined) {
    this.paramSource$.next(value);
  }

  constructor(private trainersService: TrainersService,
              private commonService: CommonService) {
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
}
