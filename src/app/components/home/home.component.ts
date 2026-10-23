import {Component, effect} from "@angular/core";
import {GeoService} from "../../services/geo.service";
import {Router} from "@angular/router";

@Component({
  selector: 'landing-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  constructor(private router: Router,
              private geoService: GeoService) {
    effect(() => {
      this.settlementId = this.geoService.currentSettlement()?.id;
    });
  }

  private settlementId?: number;

  searchText?: string;

  onSearch() {
    if (!this.searchText || this.searchText.length < 1)
      return;

    this.router.navigate(['/search'], {
      queryParams: {
        searchText: this.searchText,
        settlementId: this.settlementId
      }
    });
  }
}
