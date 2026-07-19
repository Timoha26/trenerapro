import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {ClubsService} from "../../services/clubs.service";
import {ClubModel} from "../../models/clubs/club.model";
import {SportsListenerPipe} from "../../pipes/sportsListener.pipe";
import {BehaviorSubject, Subscription, switchMap} from "rxjs";
import {FileTypeEnum} from "../../models/file.type.enum";
import {RestoreUrlService} from "../../services/restore.url.service";
import {CommonService} from "../../services/common.service";

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

  @Input() set filterParam(value: number | undefined) {
    this.paramSource$.next(value);
  }

  constructor(private clubsService: ClubsService, private restoreUrlService: RestoreUrlService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.subscription = this.paramSource$.pipe(
      switchMap((param) => this.clubsService.getTop(this.limit, param))
    ).subscribe({
      next: data => {
        let items = data ?? [];

        items?.forEach(item =>
          item.files?.forEach(file => {
            file.url = this.restoreUrlService.restoreUrl(file.url);

            if (this.commonService.isImage(file))
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
}
