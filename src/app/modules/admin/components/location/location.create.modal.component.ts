import {Component, EventEmitter} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {LocationCreateModel} from "../../../../models/locations/location.create.model";
import {SettlementSelectComponent} from "../settlement/settlement.select.component";
import {SettlementModel} from "../../../../models/settlement.model";
import {GeoService} from "../../../../services/geo.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'location-create-modal',
  templateUrl: 'location.create.modal.component.html',
  imports: [
    FormsModule,
    SettlementSelectComponent
  ],
  standalone: true
})
export class LocationCreateModalComponent {
  event: EventEmitter<LocationCreateModel> = new EventEmitter<LocationCreateModel>();

  newLocation: LocationCreateModel = {};

  constructor(private modalRef: BsModalRef, private toastr: ToastrService, private geoService: GeoService) {
  }

  onSettlementChange(event?: SettlementModel) {
    this.newLocation.settlementId = event?.id;
    this.newLocation.settlement = event;
  }

  getCoords() {
    if (!this.newLocation.settlement || !this.newLocation.settlement.settlement || !this.newLocation.address || this.newLocation.address.length == 0) {
      this.toastr.error('для определения координат недостаточно данных', 'Локация');
      return;
    }

    this.geoService.getGeoCode(this.newLocation.settlement.settlement, this.newLocation.address).subscribe({
      next: data => {
        if(data.length < 1){
          this.toastr.error('неудалось определить координаты', 'Локация');
          return;
        }

        this.newLocation.lat = Number(data[0].lat);
        this.newLocation.lon = Number(data[0].lon);
        this.toastr.success('координаты определены успешно', 'Локация');
      },
      error: () => this.toastr.error('неудалось определить координаты', 'Локация')
    });
  }

  save() {
    this.event.emit(this.newLocation);
    this.modalRef.hide();
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
