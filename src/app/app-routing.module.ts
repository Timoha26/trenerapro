import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {TrainersComponent} from "./components/trainers/trainers.component";
import {TrainersDetailsComponent} from "./components/trainers/trainers.details.component";
import {ClubsComponent} from "./components/clubs/clubs.component";
import {ClubsDetailsComponent} from "./components/clubs/clubs.details.component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'trainers', component: TrainersComponent, pathMatch: 'full'},
  {path: 'trainers/:id', component: TrainersDetailsComponent, pathMatch: 'full'},
  {path: 'clubs', component: ClubsComponent, pathMatch: 'full'},
  {path: 'clubs/:id', component: ClubsDetailsComponent, pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
