import {Component} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SortByEnum} from "../../models/sortBy.enum";
import {NgForOf} from "@angular/common";
import {SortOptionModel} from "../../models/sort.option.model";
import {CommonService} from "../../services/common.service";

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
  constructor(private commonService: CommonService) {
  }

  selectedSort: SortByEnum = SortByEnum.Rating;
  searchQuery?: string = undefined;

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

  search() {
    if(!this.searchQuery || this.searchQuery.length < 1) {
      console.log('search');
      return;
    }

    console.log(this.searchQuery);
  }

  ngOnInit() {
    this.commonService.onChangeGlobalSort(this.sortOptions[0]);
  }
}
