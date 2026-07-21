import {CurrencyPipe, NgClass, NgForOf} from "@angular/common";
import {Component, Input, OnInit, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SportsService} from "../../services/sports.service";
import {SportModel} from "../../models/sport.model";
import {ClientCategoriesService} from "../../services/client.categories.service";
import {TrainerDataFiltersModel} from "../../models/trainers/trainer.data.filters.model";
import {TrainingFormatsService} from "../../services/training.formats.service";
import {NgxSliderModule, Options} from "@angular-slider/ngx-slider";

@Component({
  selector: 'trainers-filters',
  templateUrl: './trainer.filters.component.html',
  styleUrls: ['./trainer.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgxSliderModule,
    CurrencyPipe
  ]
})
export class TrainerFiltersComponent implements OnInit {
  constructor(private sportsService: SportsService,
              private clientCategoriesService: ClientCategoriesService,
              private trainingFormatsService: TrainingFormatsService) {
  }

  @Input() dataFilters = signal<TrainerDataFiltersModel>({});

  ratings = [
    {stars: [1]},
    {stars: [1, 2]},
    {stars: [1, 2, 3]}
  ];

  range: ({ minValue: number, maxValue: number, options: Options }) = {
    minValue: 0,
    maxValue: 0,
    options: {floor: 500, ceil: 5000}
  };

  clearFilters(event: Event) {
    event.preventDefault();
    this.clearPriceRange();

    for(let category of this.clientCategories)
      category.checked = false;

    for(let format of this.trainingFormats)
      format.checked = false;

    this.dataFilters.set({});
  }

  // client category
  toggleClientCategory(categoryId: number) {
    let clientCategoryIds = this.dataFilters().clientCategoryIds ?? [];

    const index = clientCategoryIds.indexOf(categoryId);

    for (let category of this.clientCategories)
      if (category.id == categoryId) {
        category.checked = !category.checked;

        if (category.checked && index < 0)
          clientCategoryIds.push(categoryId);

        if (!category.checked && index > -1)
          clientCategoryIds.splice(index, 1);

        this.dataFilters.update(state => ({
          ...state,
          clientCategoryIds: clientCategoryIds
        }));

        return;
      }
  }

  // sport
  setSport(event: Event) {
    const select = event.target as HTMLSelectElement;

    const sportId = parseInt(select.value);

    this.dataFilters.update(state => ({
      ...state,
      sportIds: sportId ? [sportId] : undefined
    }));
  }

  getSportId() {
    const sportIds = this.dataFilters().sportIds;
    if (!sportIds || sportIds.length == 0 || !sportIds[0])
      return undefined;

    return sportIds[0];
  }

  // rating
  setRating(minRating?: number) {
    if (!minRating) return;

    this.dataFilters.update(state => ({
      ...state,
      minRating: minRating
    }));
  }

  // verified
  toggleVerified(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    this.dataFilters.update(state => ({
      ...state,
      verified: checkbox.checked
    }));
  }

  //training formats
  toggleTrainingFormat(formatId: number) {
    let trainingFormatIds = this.dataFilters().trainingFormatIds ?? [];

    const index = trainingFormatIds.indexOf(formatId);

    for (let format of this.trainingFormats)
      if (format.id == formatId) {
        format.checked = !format.checked;

        if (format.checked && index < 0)
          trainingFormatIds.push(formatId);

        if (!format.checked && index > -1)
          trainingFormatIds.splice(index, 1);

        this.dataFilters.update(state => ({
          ...state,
          trainingFormatIds: trainingFormatIds
        }));

        return;
      }
  }

  // price range
  setMinPrice() {
    this.dataFilters.update(state => ({
      ...state,
      minPrice: this.range.minValue
    }));
  }

  setMaxPrice() {
    this.dataFilters.update(state => ({
      ...state,
      maxPrice: this.range.maxValue
    }));
  }

  private clearPriceRange() {
    this.range.minValue = this.range.options.floor ?? 0;
    this.range.maxValue = this.range.options.ceil ?? 0
  }

  sports: SportModel[] = [];

  private getSports() {
    this.sportsService.get().subscribe({
      next: data => this.sports = data || []
    });
  }

  clientCategories: ({ id: number, name: string, checked: boolean })[] = [];

  private getClientCategories() {
    this.clientCategoriesService.get().subscribe({
      next: data => this.clientCategories = (data || []).map(format => ({
        id: format.id ?? 0,
        name: format.name ?? '',
        checked: false
      }))
    });
  }

  trainingFormats: ({ id: number, name: string, checked: boolean })[] = [];

  private getTrainingFormats() {
    this.trainingFormatsService.get().subscribe({
      next: data => this.trainingFormats = (data || []).map(format => ({
        id: format.id ?? 0,
        name: format.name ?? '',
        checked: false
      }))
    });
  }

  ngOnInit() {
    this.clearPriceRange();
    this.getSports();
    this.getClientCategories();
    this.getTrainingFormats();
  }
}
