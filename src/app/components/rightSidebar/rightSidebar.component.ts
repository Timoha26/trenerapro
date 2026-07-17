import {Component} from "@angular/core";
import {TrainersService} from "../../services/trainers.service";
import {TrainerModel} from "../../models/trainers/trainer.model";
import {RestoreUrlService} from "../../services/restore.url.service";
import {FileTypeEnum} from "../../models/file.type.enum";
import {NgForOf, NgIf} from "@angular/common";
import {SportsListenerPipe} from "../../pipes/sportsListener.pipe";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'rightSidebar',
  templateUrl: './rightSidebar.component.html',
  imports: [
    NgIf,
    NgForOf,
    SportsListenerPipe,
    RouterLink
  ],
  standalone: true
})
export class RightSidebarComponent {
  trainers: TrainerModel[] = [];

  constructor(private router: Router, private trainersService: TrainersService, private restoreUrlService: RestoreUrlService) {
  }

  private getTrainers() {
    this.trainersService.getTop(3).subscribe({
      next: data => {
        let items = data ?? [];

        items?.forEach(item =>
          item.files?.forEach(file => {
            file.url = this.restoreUrlService.restoreUrl(file.url);

            if (file.type == FileTypeEnum.Avatar || file.type == FileTypeEnum.Photo)
              item.logoUrl = file.url;
          })
        );

        this.trainers = items;
      }
    })
  }

  onGoToTrainerDetails(trainerId?: number) {
    this.router.navigate(['/trainers/', trainerId]);
  }

  ngOnInit() {
    this.getTrainers();
  }
}
