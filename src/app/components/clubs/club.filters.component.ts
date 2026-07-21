import {NgClass, NgForOf} from "@angular/common";
import {Component, Input, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SportsService} from "../../services/sports.service";
import {SportModel} from "../../models/sport.model";
import {ClubDataFiltersModel} from "../../models/clubs/club.data.filters.model";

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
  constructor(private sportsService: SportsService) {
  }

  @Input() dataFilters = signal<ClubDataFiltersModel>({});

  ratings = [
    {stars: [1]},
    {stars: [1, 2]},
    {stars: [1, 2, 3]}
  ];

  clearFilters(event: Event) {
    event.preventDefault();

    this.dataFilters.set({});
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

  sports: SportModel[] = [];

  private getSports() {
    this.sportsService.get().subscribe({
      next: data => {
        this.sports = data || [];
      }
    });
  }

  ngOnInit() {
    this.getSports();
  }
}
