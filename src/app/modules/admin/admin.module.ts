import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationModule} from "ngx-bootstrap/pagination";
import {ModalModule} from "ngx-bootstrap/modal";
import {FormsModule} from "@angular/forms";
import {InputMaskModule} from "@ngneat/input-mask";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {AdminRoutingModule} from './admin-routing.module';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ConfirmationModalComponent} from "./components/confirmation.modal/confirmation.modal.component";
import {AdminComponent} from "./components/admin.component";
import {FileUploadService} from "../../services/file.upload.service";
import {AuthService} from "../../services/auth/auth.service";
import {AuthGuardService} from "../../services/auth/auth.guard.service";
import {TrainersComponent} from "./components/trainers/trainers.component";
import {TrainersCreateComponent} from "./components/trainers/trainers.create.component";
import {TrainersEditComponent} from "./components/trainers/trainers.edit.component";
import {TrainersService} from "../../services/trainers.service";
import {TrainingFormatsService} from "../../services/training.formats.service";
import {ClientCategoriesService} from "../../services/client.categories.service";
import {SportsService} from "../../services/sports.service";
import {SportsSelectComponent} from "./components/sports/sports.select.component";
import {SportCreateModalComponent} from "./components/sports/sport.create.modal.component";
import {
  TrainingFormatsCreateModalComponent
} from "./components/training.formats/training.formats.create.modal.component";
import {TrainingFormatsSelectComponent} from "./components/training.formats/training.formats.select.component";
import {
  ClientCategoriesCreateModalComponent
} from "./components/client.categories/client.categories.create.modal.component";
import {ClientCategoriesSelectComponent} from "./components/client.categories/client.categories.select.component";
import {FileModalComponent} from "./components/file.modal/file.modal.component";
import {RestoreUrlService} from "../../services/restore.url.service";
import {SettlementsService} from "../../services/settlements.service";
import {SettlementSelectComponent} from "./components/settlement/settlement.select.component";
import {SettlementCreateModalComponent} from "./components/settlement/settlement.create.modal.component";


@NgModule({
  declarations: [
    AdminComponent,
    ConfirmationModalComponent,
    DashboardComponent,
    TrainersComponent,
    TrainersCreateComponent,
    TrainersEditComponent,
    SportCreateModalComponent,
    TrainingFormatsCreateModalComponent,
    ClientCategoriesCreateModalComponent,
    SettlementCreateModalComponent,
    FileModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PaginationModule,
    ModalModule.forRoot(),
    FormsModule,
    InputMaskModule,
    ToastrModule.forRoot(),
    CollapseModule,
    SportsSelectComponent,
    TrainingFormatsSelectComponent,
    ClientCategoriesSelectComponent,
    SettlementSelectComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'RUB'},
    TrainersService,
    FileUploadService,
    ToastrService,
    AuthService,
    AuthGuardService,
    TrainingFormatsService,
    ClientCategoriesService,
    SportsService,
    RestoreUrlService,
    SettlementsService
  ]
})
export class AdminModule {
}
