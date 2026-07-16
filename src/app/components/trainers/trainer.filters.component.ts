import {NgClass, NgForOf} from "@angular/common";
import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SportsService} from "../../services/sports.service";
import {SportModel} from "../../models/sport.model";
import {ClientCategoryModel} from "../../models/client.category.model";
import {ClientCategoriesService} from "../../services/client.categories.service";

@Component({
  selector: 'trainers-filters',
  templateUrl: './trainer.filters.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass
  ]
})
export class TrainerFiltersComponent {
  constructor(private sportsService: SportsService, private clientCategoriesService: ClientCategoriesService) {
  }

  sports: SportModel[] = [];

  private getSports() {
    this.sportsService.get().subscribe({
      next: data => {
        this.sports = data || [];
      }
    });
  }

  clientCategories: ClientCategoryModel[] = [];

  private getClientCategories() {
    this.clientCategoriesService.get().subscribe({
      next: data => {
        this.clientCategories = data || [];
      }
    });
  }

  ngOnInit() {
    this.getSports();
    this.getClientCategories();
  }
}
