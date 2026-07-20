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
import {ReviewsService} from "./services/reviews.service";
import {NgOptimizedImage, registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import {ErrorInterceptor} from "./services/auth/error.interceptor";
import {InputMaskModule} from '@ngneat/input-mask';
import {AuthService} from "./services/auth/auth.service";
import {AuthGuardService} from "./services/auth/auth.guard.service";
import {SettlementsService} from "./services/settlements.service";
import {PaginationComponent} from "./components/pagination/pagination.component";
import {SportsListenerPipe} from "./pipes/sportsListener.pipe";
import {PriceGradationPipe} from "./pipes/priceGradation.pipe";
import {ClientCategoriesListenerPipe} from "./pipes/clientCategoriesListener.pipe";
import {ClientCategoriesService} from "./services/client.categories.service";
import {AgePipe} from "./pipes/age.pipe";
import {TrainingFormatsListenerPipe} from "./pipes/trainingFormatsListener.pipe";
import {ReviewsPipe} from "./pipes/reviews.pipe";
import {SearchSortComponent} from "./components/search-sort/search-sort.component";
import {ClubFiltersComponent} from "./components/clubs/club.filters.component";
import {ContactsService} from "./services/contacts.service";
import {CommonService} from "./services/common.service";

registerLocaleData(localeRu)

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
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
    InputMaskModule,
    PaginationComponent,
    NgOptimizedImage,
    SportsListenerPipe,
    PriceGradationPipe,
    ClientCategoriesListenerPipe,
    AgePipe,
    TrainingFormatsListenerPipe,
    ReviewsPipe,
    SearchSortComponent,
    ClubFiltersComponent
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
    SettlementsService,
    ClientCategoriesService,
    ContactsService,
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
