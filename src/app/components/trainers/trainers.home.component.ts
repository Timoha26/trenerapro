import {Component} from "@angular/core";
import {RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainer.model";

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

  constructor(private trainersService: TrainersService) {
  }

  private getTrainers() {
    this.trainersService.get().subscribe({
      next: data => {
        this.trainers = data.items ?? [];
      }
    })
  }

  ngOnInit() {
    this.getTrainers();
  }
}
