import {NgClass, NgForOf} from "@angular/common";
import {Component, Input, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SportsService} from "../../services/sports.service";
import {SportModel} from "../../models/sport.model";
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
  constructor(private sportsService: SportsService,
              private commonService: CommonService) {
  }

  @Input() dataFilters = signal<ClubDataFiltersModel>({});

  ratings = [
    {stars: [1]},
    {stars: [1, 2]},
    {stars: [1, 2, 3]}
  ];

  clearFilters(event: Event) {
    event.preventDefault();

    this.commonService.onChangeGlobalSportId(undefined);

    this.dataFilters.set({});
  }

  // sport
  setSport(event: Event) {
    const select = event.target as HTMLSelectElement;

    const sportId = parseInt(select.value);

    this.commonService.onChangeGlobalSportId(sportId);
  }

  getSportId() {
    return this.commonService.globalFilters().sportId;
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
