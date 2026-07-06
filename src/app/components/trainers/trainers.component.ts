import {Component} from "@angular/core";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {PageResultModel} from "../../models/page.result.model";
import {TrainerFiltersModel} from "../../models/trainers/trainer.filters.model";
import {PageChangedEvent} from "ngx-bootstrap/pagination";

@Component({
  selector: 'landing-trainers',
  templateUrl: './trainers.component.html'
})
export class TrainersComponent {
  public trainers: PageResultModel<TrainerModel> = {count: 0, items: []};
  public filters: TrainerFiltersModel = {
    offset: 0,
    limit: 6,
    sort: 'name',
    desc: false
  };

  constructor(private trainersService: TrainersService) {
  }

  private getTrainers(filters: TrainerFiltersModel) {
    this.trainersService.get(filters).subscribe({
      next: data => {
        this.trainers = data;
      }
    })
  }

  private setOffset(page: number, itemsPerPage: number) {
    this.filters.offset = (page - 1) * itemsPerPage;
    this.getTrainers(this.filters);
  }

  setPage(event: PageChangedEvent) {
    this.setOffset(event.page, event.itemsPerPage);
  }

  ngOnInit() {
    this.getTrainers(this.filters);
  }
}
