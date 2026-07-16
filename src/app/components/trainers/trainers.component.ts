import {Component, OnInit, signal} from "@angular/core";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {PageResultModel} from "../../models/page.result.model";
import {TrainerFiltersModel} from "../../models/trainers/trainer.filters.model";
import {PageStateEvent} from "../../models/page.state.event";
import {RestoreUrlService} from "../../services/restore.url.service";
import {FileTypeEnum} from "../../models/file.type.enum";
import {toObservable} from "@angular/core/rxjs-interop";
import {distinctUntilChanged, switchMap} from "rxjs";

@Component({
  selector: 'landing-trainers',
  templateUrl: './trainers.component.html'
})
export class TrainersComponent {
  public filters = signal<TrainerFiltersModel>({
    offset: 0,
    limit: 6,
    sort: 'name',
    desc: false,
    settlementIds: undefined,
    sportIds: undefined,
    clientCategoryIds: undefined,
    trainingFormatIds: undefined,
    verified: undefined,
    minRating: undefined,
    minPrice: undefined,
    maxPrice: undefined
  });

  public trainers: PageResultModel<TrainerModel> = {count: 0, items: []};

  constructor(private trainersService: TrainersService, private restoreUrlService: RestoreUrlService) {
  }

  private dataSubscription = toObservable(this.filters).pipe(
    distinctUntilChanged(),
    switchMap(id => this.trainersService.get(this.filters()))
  ).subscribe({
    next: data => {
      data.items?.forEach(item =>
        item.files?.forEach(file => {
          file.url = this.restoreUrlService.restoreUrl(file.url);

          if (file.type == FileTypeEnum.Avatar || file.type == FileTypeEnum.Photo)
            item.logoUrl = file.url;
        })
      );

      this.trainers = data;
    }
  });

  onSportIdChange(sportId?: number) {
    this.filters.update(prev => ({
      ...prev,
      sportIds: sportId ? [sportId] : undefined,
      offset: 0
    }));
  }

  onPageChange(event: PageStateEvent): void {
    this.filters.update(prev => ({
      ...prev,
      offset: (event.page - 1) * event.itemsPerPage
    }));
  }
}
