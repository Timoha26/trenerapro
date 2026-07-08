import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./components/admin.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuardService} from "../../services/auth/auth.guard.service";
import {TrainersComponent} from "./components/trainers/trainers.component";
import {TrainersCreateComponent} from "./components/trainers/trainers.create.component";
import {TrainersEditComponent} from "./components/trainers/trainers.edit.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '', component: AdminComponent, children: [
      {path: 'dashboard', component: DashboardComponent, title: 'Aдминка', canActivate: [AuthGuardService]},
      {path: 'trainers', component: TrainersComponent, title: 'Aдминка тренеры', canActivate: [AuthGuardService]},
      {path: 'trainers/create', component: TrainersCreateComponent, title: 'Админка новый тренер', canActivate: [AuthGuardService]},
      {path: 'trainers/:id/edit', component: TrainersEditComponent, title: 'Админка изменить тренера', canActivate: [AuthGuardService]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
