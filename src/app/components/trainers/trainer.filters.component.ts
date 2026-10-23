import {CurrencyPipe, NgClass, NgForOf} from "@angular/common";
import {Component, Input, OnInit, signal} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoriesService} from "../../services/categories.service";
import {ClientCategoriesService} from "../../services/client.categories.service";
import {TrainerDataFiltersModel} from "../../models/trainers/trainer.data.filters.model";
import {TrainingFormatsService} from "../../services/training.formats.service";
import {NgxSliderModule, Options} from "@angular-slider/ngx-slider";
import {CommonService} from "../../services/common.service";
import {CategoryModel} from "../../models/category.model";

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
    CurrencyPipe,
    ReactiveFormsModule
  ]
})
export class TrainerFiltersComponent implements OnInit {
  constructor(private categoriesService: CategoriesService,
              private clientCategoriesService: ClientCategoriesService,
              private trainingFormatsService: TrainingFormatsService,
              private commonService: CommonService) {
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

  selectedCategoryId?: number = undefined;

  clearFilters(event: Event) {
    event.preventDefault();
    this.clearPriceRange();

    for(let category of this.clientCategories)
      category.checked = false;

    for(let format of this.trainingFormats)
      format.checked = false;

    this.commonService.onChangeGlobalCategoryId(undefined);

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

  // category
  setCategory(event: Event) {
    const select = event.target as HTMLSelectElement;

    const categoryId = parseInt(select.value);

    this.commonService.onChangeGlobalCategoryId(categoryId);
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

  categories: CategoryModel[] = [];

  private getCategories() {
    this.categoriesService.get().subscribe({
      next: data => {
        this.categories = data || [];
        this.selectedCategoryId = this.commonService.globalFilters().categoryId;
      }
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
    this.getCategories();
    this.getClientCategories();
    this.getTrainingFormats();
  }
}
