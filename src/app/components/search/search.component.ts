import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../services/search.service";
import {Subscription} from "rxjs";
import {SearchItemModel} from "../../models/search/search.item.model";
import {EntityTypeEnum} from "../../models/search/entity.type.enum";

@Component({
  selector: 'landing-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService) {
  }

  private routeSubscription!: Subscription;

  private settlementId?: number;

  private entityType?: EntityTypeEnum;

  searchText?: string;

  searchResult: SearchItemModel[] = [];

  onSearch() {
    if (!this.searchText || this.searchText.length < 1)
      return;

    this.searchService.get(this.searchText, this.settlementId).subscribe({
      next: (data) => this.searchResult = data
    });
  }

  getLink(item: SearchItemModel) {
    let path: string;

    switch (item.entityType) {
      case EntityTypeEnum.Trainer:
        path = '/trainers';
        break;
      case EntityTypeEnum.Club:
        path = '/clubs';
        break;
      default:
        path = '/';
        break;
    }

    if (path != '/')
      path = path + '/' + item.entityId;

    console.log(path);

    return path;
  }

  ngOnInit() {
    this.routeSubscription = this.route.queryParamMap.subscribe(params => {
      const searchText = params.get('searchText');

      if (searchText)
        this.searchText = searchText;

      const settlementId = params.get('settlementId');

      if (settlementId && !isNaN(+settlementId))
        this.settlementId = +settlementId;

      const entityType = params.get('entityType');

      if (entityType && Object.values(EntityTypeEnum).includes(entityType as EntityTypeEnum))
        this.entityType = entityType as EntityTypeEnum;

      console.log(this.searchText, this.settlementId, this.entityType);

      if (this.searchText && this.searchText.length > 0)
        this.onSearch();
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
