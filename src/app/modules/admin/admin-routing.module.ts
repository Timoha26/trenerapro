import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./components/admin.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuardService} from "../../services/auth/auth.guard.service";
import {TrainersComponent} from "./components/trainers/trainers.component";
import {TrainersCreateComponent} from "./components/trainers/trainers.create.component";
import {TrainersEditComponent} from "./components/trainers/trainers.edit.component";
import {ClubsComponent} from "./components/clubs/clubs.component";
import {ClubsCreateComponent} from "./components/clubs/clubs.create.component";
import {ClubsEditComponent} from "./components/clubs/clubs.edit.component";
import {CategoriesComponent} from "./components/categories/categories.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '', component: AdminComponent, children: [
      {path: 'dashboard', component: DashboardComponent, title: 'ТренерPRO-админка', canActivate: [AuthGuardService]},
      {path: 'categories', component: CategoriesComponent, title: 'ТренерPRO-админка категории', canActivate: [AuthGuardService]},
      {path: 'trainers', component: TrainersComponent, title: 'ТренерPRO-админка тренеры', canActivate: [AuthGuardService]},
      {path: 'trainers/create', component: TrainersCreateComponent, title: 'ТренерPRO-админка новый тренер', canActivate: [AuthGuardService]},
      {path: 'trainers/:id/edit', component: TrainersEditComponent, title: 'ТренерPRO-админка изменить тренера', canActivate: [AuthGuardService]},
      {path: 'clubs', component: ClubsComponent, title: 'ТренерPRO-админка клубы', canActivate: [AuthGuardService]},
      {path: 'clubs/create', component: ClubsCreateComponent, title: 'ТренерPRO-админка новый клуб', canActivate: [AuthGuardService]},
      {path: 'clubs/:id/edit', component: ClubsEditComponent, title: 'ТренерPRO-админка изменить клуб', canActivate: [AuthGuardService]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
