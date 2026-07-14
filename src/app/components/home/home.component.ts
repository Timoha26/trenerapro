import {Component} from "@angular/core";
import {RestoreUrlService} from "../../services/restore.url.service";

@Component({
  selector: 'landing-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  heroImageUrl?: string;
  becomeImageUrl?: string;

  constructor(private restoreUrlService: RestoreUrlService) {
  }

  ngOnInit(){
    this.heroImageUrl = this.restoreUrlService.restoreUrl('/trainerpro/static/guys_playing.png');
    this.heroImageUrl = this.restoreUrlService.restoreUrl('/trainerpro/static/guys_resting.png');
  }
}
