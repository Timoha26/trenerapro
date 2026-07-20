import {Component, EventEmitter, Output} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SortByEnum} from "../../models/sortBy.enum";
import {NgForOf} from "@angular/common";
import {SortOptionModel} from "../../models/sort.option.model";

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
  constructor() {
  }

  selectedSort: SortByEnum = SortByEnum.Rating;

  sortOptions: SortOptionModel[] = [
    {sort: SortByEnum.Rating, desc: true, name: "По рейтингу"},
    {sort: SortByEnum.Reviews, desc: true, name: "По отзывам"},
    {sort: SortByEnum.Experience, desc: true, name: "По опыту"}
  ];

  @Output() sortChange: EventEmitter<SortOptionModel> = new EventEmitter<SortOptionModel>();

  onChangeSort(selectedSort: SortByEnum) {
    for(const option of this.sortOptions)
      if(option.sort == selectedSort){
        this.sortChange.emit(option);
        return;
      }

    this.sortChange.emit(this.sortOptions[0]);
  }

  ngOnInit() {
    this.sortChange.emit(this.sortOptions[0]);
  }
}
