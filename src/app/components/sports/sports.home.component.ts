import {Component} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'landing-sports-home',
  templateUrl: './sports.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ]
})
export class SportsHomeComponent {
  constructor() {
  }
}
