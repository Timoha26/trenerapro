import {Component, effect, signal, untracked} from "@angular/core";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {PageResultModel} from "../../models/page.result.model";
import {TrainerFiltersModel} from "../../models/trainers/trainer.filters.model";
import {PageStateEvent} from "../../models/page.state.event";
import {toObservable} from "@angular/core/rxjs-interop";
import {distinctUntilChanged, switchMap} from "rxjs";
import {SortByEnum} from "../../models/sortBy.enum";
import {CommonService} from "../../services/common.service";
import {SortOptionModel} from "../../models/sort.option.model";
import {TrainerDataFilters} from "../../models/trainers/trainer.data.filters";

@Component({
  selector: 'landing-trainers',
  templateUrl: './trainers.component.html'
})
export class TrainersComponent {
  private debounceTimer: any;

  public filters = signal<TrainerFiltersModel>({
    offset: 0,
    limit: 6,
    sort: SortByEnum.Rating,
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

  constructor(private trainersService: TrainersService,
              private commonService: CommonService) {
    effect((onCleanup) => {
      const filters = this.dataFilters();

      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        untracked(() => this.filters.update(prev => ({
          ...prev,
          settlementIds: filters.settlementIds,
          sportIds: filters.sportIds,
          clientCategoryIds: filters.clientCategoryIds,
          trainingFormatIds: filters.trainingFormatIds,
          verified: filters.verified,
          minRating: filters.minRating,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          offset: 0
        })));
      }, 500);

      onCleanup(() => clearTimeout(this.debounceTimer));
    });
  }

  dataFilters = signal<TrainerDataFilters>({});

  private dataSubscription = toObservable(this.filters).pipe(
    distinctUntilChanged(),
    switchMap(id => this.trainersService.get(this.filters()))
  ).subscribe({
    next: data => {
      data.items?.forEach(item =>
        item.files?.forEach(file => {
          file.url = this.commonService.restoreUrl(file.url);

          if (this.commonService.isLogo(file))
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

  onSortChange(event: SortOptionModel) {
    this.filters.update(prev => ({
      ...prev,
      sort: event.sort,
      desc: event.desc,
      offset: 0
    }));
  }
}
