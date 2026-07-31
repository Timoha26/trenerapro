import {Component} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {AuthModel} from "./models/auth.model";
import {NgForm} from "@angular/forms";
import {TokenModel} from "./models/token.model";
import {CommonService} from "./services/common.service";
import {GeoService} from "./services/geo.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {SelectSettlementModalComponent} from "./components/settlements/select.settlement.modal.component";
import {SettlementModel} from "./models/settlement.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'trenerapro-app';
  logoUrl?: string;
  showLoginForm: boolean = false;
  authError?: string;
  authData: AuthModel = {
    username: undefined,
    password: undefined
  };
  currentSettlement?: SettlementModel = undefined;
  modalRef?: BsModalRef;

  constructor(private authService: AuthService,
              private commonService: CommonService,
              private geoService: GeoService,
              private modalService: BsModalService) {
  }

  isLogged() {
    return this.authService.isLogged();
  }

  login(form: NgForm) {
    this.authService.login(this.authData).subscribe({
      next: (data: TokenModel) => {
        form.resetForm();
        this.showLoginForm = false;
        this.authError = undefined;
      },
      error: (error) => {
        form.resetForm();
        this.authError = 'Неверный логин или пароль!';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  selectCity() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        selectedSettlement: this.currentSettlement?.settlement,
        chosenSettlement: this.currentSettlement
      }
    };

    this.modalRef = this.modalService.show(SelectSettlementModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (settlement: SettlementModel) => {
        if (settlement)
          this.geoService.selectSettlement(settlement);

        this.currentSettlement = this.geoService.currentSettlement();
        this.commonService.onChangeGlobalCoords(this.currentSettlement?.lat, this.currentSettlement?.lon);
        this.commonService.onChangeGlobalSettlementId(this.currentSettlement?.id);
      }
    });
  }

  ngOnInit() {
    this.logoUrl = this.commonService.restoreUrl('/trainerpro/static/logo2.svg');

    this.geoService.getSettlements().subscribe({
      next: () => {
        this.currentSettlement = this.geoService.currentSettlement();
        this.commonService.onChangeGlobalCoords(this.currentSettlement?.lat, this.currentSettlement?.lon);
        this.commonService.onChangeGlobalSettlementId(this.currentSettlement?.id);
      }
    });
  }
}
