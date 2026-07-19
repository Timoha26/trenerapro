import {NgClass, NgForOf} from "@angular/common";
import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SportsService} from "../../services/sports.service";
import {SportModel} from "../../models/sport.model";

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
