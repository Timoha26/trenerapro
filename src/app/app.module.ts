import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {TrainersComponent} from "./components/trainers/trainers.component";
import {TrainersDetailsComponent} from "./components/trainers/trainers.details.component";
import {ClubsComponent} from "./components/clubs/clubs.component";
import {ClubsDetailsComponent} from "./components/clubs/clubs.details.component";
import {TrainersService} from "./services/trainers.service";
import {ClubsService} from "./services/clubs.service";
import {TrainersHomeComponent} from "./components/trainers/trainers.home.component";
import {HttpClientModule} from "@angular/common/http";
import {ClubsHomeComponent} from "./components/clubs/clubs.home.component";
import {ReviewsHomeComponent} from "./components/reviews/reviews.home.component";
import {SportsHomeComponent} from "./components/sports/sports.home.component";
import {WhyusHomeComponent} from "./components/whyus/whyus.home.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TrainersComponent,
    TrainersDetailsComponent,
    ClubsComponent,
    ClubsDetailsComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TrainersHomeComponent,
    ClubsHomeComponent,
    ReviewsHomeComponent,
    SportsHomeComponent,
    WhyusHomeComponent
  ],
  providers: [
    TrainersService,
    ClubsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
