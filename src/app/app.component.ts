import {Component} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
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

  loginModal() {
    this.authService.loginModal();
  }

  logout() {
    this.authService.logout();
  }

  selectCity() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md landing-modal',
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
        this.commonService.onChangeGlobalSettlement(this.currentSettlement?.id, this.currentSettlement?.lat, this.currentSettlement?.lon);
      }
    });
  }

  getUserCoords() {
    this.geoService.getGeoUser().subscribe({
      next: (position) => this.commonService.onChangeUserGlobalCoords(position.coords.latitude, position.coords.longitude),
      error: (error) => console.error(error)
    });
  }

  ngOnInit() {
    this.getUserCoords();

    this.logoUrl = this.commonService.restoreUrl('/trainerpro/static/logo3.svg');

    this.geoService.getSettlements().subscribe({
      next: () => {
        this.currentSettlement = this.geoService.currentSettlement();
        this.commonService.onChangeGlobalSettlement(this.currentSettlement?.id, this.currentSettlement?.lat, this.currentSettlement?.lon);
      }
    });
  }
}
