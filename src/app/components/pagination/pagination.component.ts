import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PageStateEvent} from "../../models/page.state.event";

@Component({
  selector: 'tp-pagination',
  standalone: true,
  templateUrl: 'pagination.component.html',
  imports: [CommonModule]
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 6;

  @Output() pageChange = new EventEmitter<PageStateEvent>();

  pages: (number | string)[] = [];

  private state: PageStateEvent = {
    page: 0,
    itemsPerPage: 0
  }

  ngOnInit() {
    this.calculatePages();
  }

  ngOnChanges() {
    this.calculatePages();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  calculatePages() {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7)
      this.pages = Array.from({length: total}, (_, i) => i + 1);
    else if (current <= 4)
      this.pages = [1, 2, 3, 4, 5, '...', total];
    else if (current > total - 4)
      this.pages = [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    else
      this.pages = [1, '...', current - 1, current, current + 1, '...', total];
  }

  onPageChange(page: number | string) {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.state.page = page;
      this.state.itemsPerPage = this.itemsPerPage;
      this.currentPage = page;
      this.pageChange.emit(this.state);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.state.page = this.currentPage - 1;
      this.state.itemsPerPage = this.itemsPerPage;
      this.currentPage = this.state.page;
      this.pageChange.emit(this.state);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.state.page = this.currentPage + 1;
      this.state.itemsPerPage = this.itemsPerPage;
      this.currentPage = this.state.page;
      this.pageChange.emit(this.state);
    }
  }
}
