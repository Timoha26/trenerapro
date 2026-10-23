import {Component, effect, Input} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SortByEnum} from "../../models/sortBy.enum";
import {NgForOf} from "@angular/common";
import {SortOptionModel} from "../../models/sort.option.model";
import {CommonService} from "../../services/common.service";
import {GeoService} from "../../services/geo.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntityTypeEnum} from "../../models/search/entity.type.enum";

@Component({
  selector: 'search-sort',
  templateUrl: './search-sort.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  standalone: true
})
export class SearchSortComponent {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private geoService: GeoService) {
    effect(() => {
      this.settlementId = this.geoService.currentSettlement()?.id;
    });
  }

  private settlementId?: number;
  private entityType?: EntityTypeEnum;
  selectedSort: SortByEnum = SortByEnum.Rating;
  @Input() searchText?: string;

  sortOptions: SortOptionModel[] = [
    {sort: SortByEnum.Rating, desc: true, name: "По рейтингу"},
    {sort: SortByEnum.Reviews, desc: true, name: "По отзывам"},
    {sort: SortByEnum.Experience, desc: true, name: "По опыту"}
  ];

  onChangeSort(selectedSort: SortByEnum) {
    for (const option of this.sortOptions)
      if (option.sort == selectedSort) {
        this.commonService.onChangeGlobalSort(option);
        return;
      }

    this.commonService.onChangeGlobalSort(this.sortOptions[0]);
  }

  onSearch() {
    if (!this.searchText || this.searchText.length < 1)
      return;

    this.router.navigate(['/search'], {
      queryParams: {
        searchText: this.searchText,
        settlementId: this.settlementId,
        entityType: this.entityType
      }
    });
  }

  ngOnInit() {
    this.commonService.onChangeGlobalSort(this.sortOptions[0]);

    switch (this.route.snapshot.routeConfig?.path) {
      case 'trainers':
        this.entityType = EntityTypeEnum.Trainer;
        break;
      case 'clubs':
        this.entityType = EntityTypeEnum.Club;
        break;
      default:
        this.entityType = undefined;
        break;
    }
  }
}
