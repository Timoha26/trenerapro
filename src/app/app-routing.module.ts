import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {TrainersComponent} from "./components/trainers/trainers.component";
import {TrainersDetailsComponent} from "./components/trainers/trainers.details.component";
import {ClubsComponent} from "./components/clubs/clubs.component";
import {ClubsDetailsComponent} from "./components/clubs/clubs.details.component";
import {AuthGuardService} from "./services/auth/auth.guard.service";
import {QuestionnaireComponent} from "./components/questionnaire/questionnaire.component";
import {AboutComponent} from "./components/about/about.component";
import {VerificationComponent} from "./components/verification/verification.component";
import {SearchComponent} from "./components/search/search.component";
import {CategoriesComponent} from "./components/categories/categories.component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full', title: 'ТренерPRO — Найдите проверенного спортивного тренера или клуб'},
  {path: 'categories', component: CategoriesComponent, pathMatch: 'full', title: 'ТренерPRO категории'},
  {path: 'trainers', component: TrainersComponent, pathMatch: 'full', title: 'ТренерPRO тренеры'},
  {path: 'trainers/:id', component: TrainersDetailsComponent, pathMatch: 'full', title: 'ТренерPRO тренеры'},
  {path: 'clubs', component: ClubsComponent, pathMatch: 'full', title: 'ТренерPRO клубы'},
  {path: 'clubs/:id', component: ClubsDetailsComponent, pathMatch: 'full', title: 'ТренерPRO клубы'},
  {path: 'questionnaire', component: QuestionnaireComponent, pathMatch: 'full', title: 'ТренерPRO анкета'},
  {path: 'about', component: AboutComponent, pathMatch: 'full', title: 'ТренерPRO о нас'},
  {path: 'verification', component: VerificationComponent, pathMatch: 'full', title: 'ТренерPRO о проверке'},
  {path: 'search', component: SearchComponent, pathMatch: 'full', title: 'ТренерPRO поиск'},
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    title: 'ТренерPRO-админка',
    canMatch: [AuthGuardService]
  },
  {path: '**', component: NotFoundComponent, title: 'ТренерPRO 404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
