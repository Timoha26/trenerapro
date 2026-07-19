import {Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'search-sort',
  templateUrl: './search-sort.component.html',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class SearchSortComponent {
  constructor() {
  }
}
