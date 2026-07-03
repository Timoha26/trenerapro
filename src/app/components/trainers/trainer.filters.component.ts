import {NgForOf} from "@angular/common";
import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SportsService} from "../../services/sports.service";
import {SportModel} from "../../models/sport.model";

@Component({
  selector: 'trainers-filters',
  templateUrl: './trainer.filters.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ]
})
export class TrainerFiltersComponent {
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
