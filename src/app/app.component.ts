import {Component} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {AuthModel} from "./models/auth.model";
import {NgForm} from "@angular/forms";
import {TokenModel} from "./models/token.model";
import {CommonService} from "./services/common.service";
import {GeoService} from "./services/geo.service";
import {CityModel} from "./models/cities/city.model";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {SelectCityModalComponent} from "./components/city/select.city.modal.component";

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
  currentCity?: CityModel = undefined;
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
        selectedCity: this.currentCity?.name,
        chosenCity: this.currentCity
      }
    };

    this.modalRef = this.modalService.show(SelectCityModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (city: CityModel) => {
        if(city)
          this.geoService.selectCity(city);

        this.currentCity = this.geoService.currentCity();
        this.commonService.onChangeGlobalCoords(this.currentCity?.coords.lat, this.currentCity?.coords.lon);
      }
    });
  }

  ngOnInit() {
    this.logoUrl = this.commonService.restoreUrl('/trainerpro/static/logo2.svg');

    this.geoService.getCities().subscribe({
      next: () => {
        this.currentCity = this.geoService.currentCity();
        this.commonService.onChangeGlobalCoords(this.currentCity?.coords.lat, this.currentCity?.coords.lon);
      }
    });
  }
}
