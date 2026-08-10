import {Component, computed, effect, signal, untracked} from "@angular/core";
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
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";

@Component({
  selector: 'landing-clubs',
  templateUrl: './clubs.component.html'
})
export class ClubsComponent {
  private debounceTimer: any;

  private readonly combinedFilters = computed(() => {
    const globalFilters = this.commonService.globalFilters();
    const filters = this.dataFilters();

    return {
      coords: globalFilters.coords,
      distance: globalFilters.distance,
      settlementIds: globalFilters.settlementId ? [globalFilters.settlementId] : undefined,
      sportIds: globalFilters.sportId ? [globalFilters.sportId] : undefined,
      verified: filters.verified,
      minRating: filters.minRating,
      sort: globalFilters.sort,
      desc: globalFilters.desc
    };
  });

  constructor(private clubsService: ClubsService,
              private commonService: CommonService,
              private modalService: BsModalService) {
    effect((onCleanup) => {
      const filters= this.combinedFilters();

      this.debounceTimer = setTimeout(() => {
        untracked(() => this.filters.update(prev => ({
          ...prev,
          coords: filters.coords,
          distance: filters.distance,
          settlementIds: filters.settlementIds,
          sportIds: filters.sportIds,
          verified: filters.verified,
          minRating: filters.minRating,
          sort: filters.sort,
          desc: filters.desc,
          offset: 0
        })));
      }, 300);

      onCleanup(() => clearTimeout(this.debounceTimer));
    });
  }

  public filters = signal<ClubFiltersModel>({
    offset: 0,
    limit: 6,
    sort: SortByEnum.Rating,
    desc: false
  });

  public clubs: PageResultModel<ClubModel> = {count: 0, items: []};
  private modalRef?: BsModalRef;

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

  onPageChange(event: PageStateEvent): void {
    this.filters.update(prev => ({
      ...prev,
      offset: (event.page - 1) * event.itemsPerPage
    }));
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
