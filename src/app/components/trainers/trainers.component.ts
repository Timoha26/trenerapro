import {Component, computed, effect, signal, untracked} from "@angular/core";
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
import {TrainerDataFiltersModel} from "../../models/trainers/trainer.data.filters.model";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ReviewCreateModalComponent} from "../reviews/review.create.modal.component";
import {ReviewModel} from "../../models/reviews/review.model";

@Component({
  selector: 'landing-trainers',
  templateUrl: './trainers.component.html'
})
export class TrainersComponent {
  private debounceTimer: any;

  private readonly combinedFilters = computed(() => {
    const globalFilters = this.commonService.globalFilters();
    const filters = this.dataFilters();

    return {
      coords: globalFilters.coords,
      distance: globalFilters.distance,
      settlementIds: globalFilters.settlementId ? [globalFilters.settlementId] : undefined,
      sportIds: globalFilters.sportId ? [globalFilters.sportId] : undefined,
      clientCategoryIds: filters.clientCategoryIds,
      trainingFormatIds: filters.trainingFormatIds,
      verified: filters.verified,
      minRating: filters.minRating,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: globalFilters.sort,
      desc: globalFilters.desc
    };
  });

  constructor(private trainersService: TrainersService,
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
          clientCategoryIds: filters.clientCategoryIds,
          trainingFormatIds: filters.trainingFormatIds,
          verified: filters.verified,
          minRating: filters.minRating,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
          desc: filters.desc,
          offset: 0
        })));
      }, 300);

      onCleanup(() => clearTimeout(this.debounceTimer));
    });
  }

  public filters = signal<TrainerFiltersModel>({
    offset: 0,
    limit: 6,
    sort: SortByEnum.Rating,
    desc: true
  });

  public trainers: PageResultModel<TrainerModel> = {count: 0, items: []};
  private modalRef?: BsModalRef;

  dataFilters = signal<TrainerDataFiltersModel>({});

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
