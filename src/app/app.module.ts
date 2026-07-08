import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
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
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ClubsHomeComponent} from "./components/clubs/clubs.home.component";
import {ReviewsHomeComponent} from "./components/reviews/reviews.home.component";
import {SportsHomeComponent} from "./components/sports/sports.home.component";
import {WhyusHomeComponent} from "./components/whyus/whyus.home.component";
import {SportsService} from "./services/sports.service";
import {FormsModule} from "@angular/forms";
import {TrainerFiltersComponent} from "./components/trainers/trainer.filters.component";
import {RightSidebarComponent} from "./components/rightSidebar/rightSidebar.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PaginationModule} from "ngx-bootstrap/pagination";
import {ReviewsService} from "./services/reviews.service";
import {registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import {ErrorInterceptor} from "./services/auth/error.interceptor";
import { InputMaskModule } from '@ngneat/input-mask';
import {AuthService} from "./services/auth/auth.service";
import {AuthGuardService} from "./services/auth/auth.guard.service";
import {LoginComponent} from "./components/login/login.component";
import {RestoreUrlService} from "./services/restore.url.service";

registerLocaleData(localeRu)

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    HomeComponent,
    TrainersComponent,
    TrainersDetailsComponent,
    ClubsComponent,
    ClubsDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TrainersHomeComponent,
    ClubsHomeComponent,
    ReviewsHomeComponent,
    SportsHomeComponent,
    WhyusHomeComponent,
    TrainerFiltersComponent,
    RightSidebarComponent,
    BrowserAnimationsModule,
    PaginationModule,
    InputMaskModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'RUB'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    TrainersService,
    ClubsService,
    SportsService,
    ReviewsService,
    AuthService,
    AuthGuardService,
    RestoreUrlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
