import {NgClass, NgForOf} from "@angular/common";
import {Component, Input, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CategoriesService} from "../../services/categories.service";
import {CategoryModel} from "../../models/category.model";
import {ClubDataFiltersModel} from "../../models/clubs/club.data.filters.model";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'clubs-filters',
  templateUrl: './club.filters.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass
  ]
})
export class ClubFiltersComponent {
  constructor(private categoriesService: CategoriesService,
              private commonService: CommonService) {
  }

  @Input() dataFilters = signal<ClubDataFiltersModel>({});

  ratings = [
    {stars: [1]},
    {stars: [1, 2]},
    {stars: [1, 2, 3]}
  ];

  selectedCategoryId?: number = undefined;

  clearFilters(event: Event) {
    event.preventDefault();

    this.commonService.onChangeGlobalCategoryId(undefined);

    this.dataFilters.set({});
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

  categories: CategoryModel[] = [];

  private getCategories() {
    this.categoriesService.get().subscribe({
      next: data => {
        this.categories = data || [];
        this.selectedCategoryId = this.commonService.globalFilters().categoryId;
      }
    });
  }

  ngOnInit() {
    this.getCategories();
  }
}
