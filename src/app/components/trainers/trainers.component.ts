import {Component} from "@angular/core";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {PageResultModel} from "../../models/page.result.model";
import {TrainerFiltersModel} from "../../models/trainers/trainer.filters.model";
import {PageStateEvent} from "../../models/page.state.event";
import {TrainerDataFilters} from "../../models/trainers/trainer.data.filters";
import {RestoreUrlService} from "../../services/restore.url.service";
import {FileTypeEnum} from "../../models/file.type.enum";

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
  dataFilters: TrainerDataFilters = {
    settlementIds: undefined,
    sportIds: undefined,
    clientCategoryIds: undefined,
    trainingFormatIds: undefined,
    verified: undefined,
    minRating: undefined,
    minPrice: undefined,
    maxPrice: undefined
  };

  constructor(private trainersService: TrainersService, private restoreUrlService: RestoreUrlService) {
  }

  private getTrainers(filters: TrainerFiltersModel, dataFilters: TrainerDataFilters) {
    this.trainersService.get(filters, dataFilters).subscribe({
      next: data => {
        data.items?.forEach(item =>
          item.files?.forEach(file => {
            file.url = this.restoreUrlService.restoreUrl(file.url);

            if(file.type == FileTypeEnum.Avatar || file.type == FileTypeEnum.Photo)
              item.logoUrl = file.url;
          })
        );

        this.trainers = data;
      }
    });
  }

  private setOffset(page: number, itemsPerPage: number) {
    this.filters.offset = (page - 1) * itemsPerPage;
    this.getTrainers(this.filters, this.dataFilters);
  }

  setPage(event: PageStateEvent) {
    this.setOffset(event.page, event.itemsPerPage);
  }

  ngOnInit() {
    this.getTrainers(this.filters, this.dataFilters);
  }
}
