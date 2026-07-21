import {Component, effect, signal, untracked} from "@angular/core";
import {SortByEnum} from "../../models/sortBy.enum";
import {PageResultModel} from "../../models/page.result.model";
import {toObservable} from "@angular/core/rxjs-interop";
import {distinctUntilChanged, switchMap} from "rxjs";
import {PageStateEvent} from "../../models/page.state.event";
import {ClubFiltersModel} from "../../models/clubs/club.filters.model";
import {ClubModel} from "../../models/clubs/club.model";
import {ClubsService} from "../../services/clubs.service";
import {CommonService} from "../../services/common.service";
import {ClubDataFiltersModel} from "../../models/clubs/club.data.filters.model";
import {SortOptionModel} from "../../models/sort.option.model";

@Component({
  selector: 'landing-clubs',
  templateUrl: './clubs.component.html'
})
export class ClubsComponent {
  private debounceTimer: any;

  public filters = signal<ClubFiltersModel>({
    offset: 0,
    limit: 6,
    sort: SortByEnum.Rating,
    desc: false,
    settlementIds: undefined,
    sportIds: undefined,
    verified: undefined,
    minRating: undefined
  });

  public clubs: PageResultModel<ClubModel> = {count: 0, items: []};

  constructor(private clubsService: ClubsService,
              private commonService: CommonService) {
    effect((onCleanup) => {
      const filters = this.dataFilters();

      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        untracked(() => this.filters.update(prev => ({
          ...prev,
          settlementIds: filters.settlementIds,
          sportIds: filters.sportIds,
          verified: filters.verified,
          minRating: filters.minRating,
          offset: 0
        })));
      }, 500);

      onCleanup(() => clearTimeout(this.debounceTimer));
    });
  }

  dataFilters = signal<ClubDataFiltersModel>({});

  private dataSubscription = toObservable(this.filters).pipe(
    distinctUntilChanged(),
    switchMap(id => this.clubsService.get(this.filters()))
  ).subscribe({
    next: data => {
      data.items?.forEach(item =>
        item.files?.forEach(file => {
          file.url = this.commonService.restoreUrl(file.url);

          if (this.commonService.isLogo(file))
            item.logoUrl = file.url;
        })
      );

      this.clubs = data;
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
