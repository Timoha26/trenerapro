import {Component} from "@angular/core";
import {RestoreUrlService} from "../../services/restore.url.service";

@Component({
  selector: 'landing-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  selectedSportId?: number = undefined;

  constructor(private restoreUrlService: RestoreUrlService) {
  }
}
