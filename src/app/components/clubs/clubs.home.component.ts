import {Component} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {ClubsService} from "../../services/clubs.service";
import {ClubModel} from "../../models/clubs/club.model";

@Component({
  selector: 'landing-clubs-home',
  templateUrl: './clubs.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ]
})
export class ClubsHomeComponent {
  public clubs: ClubModel[] = [];

  constructor(private clubsService: ClubsService) {
  }

  private getClubs() {
    this.clubsService.get().subscribe({
      next: data => {
        this.clubs = data.items ?? [];
      }
    })
  }

  ngOnInit() {
    this.getClubs();
  }
}
