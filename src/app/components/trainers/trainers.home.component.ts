import {Component} from "@angular/core";
import {RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {RestoreUrlService} from "../../services/restore.url.service";

@Component({
  selector: 'landing-trainers-home',
  templateUrl: './trainers.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    CurrencyPipe
  ]
})
export class TrainersHomeComponent {
  public trainers: TrainerModel[] = [];

  constructor(private trainersService: TrainersService, private restoreUrlService: RestoreUrlService) {
  }

  private getTrainers() {
    this.trainersService.getTop().subscribe({
      next: data => {
        let items = data.items ?? [];

        items.forEach(item => {
          if(item.files)
            item.files.forEach(file => {
              file.url = this.restoreUrlService.restoreUrl(file.url);
            });
        });

        this.trainers = items;
      }
    })
  }

  ngOnInit() {
    this.getTrainers();
  }
}
