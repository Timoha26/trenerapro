import {Component, EventEmitter} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {LocationCreateModel} from "../../../../models/locations/location.create.model";
import {SettlementSelectComponent} from "../settlement/settlement.select.component";
import {SettlementModel} from "../../../../models/settlement.model";

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

  constructor(private modalRef: BsModalRef) {
  }

  onSettlementChange(event?: SettlementModel){
    this.newLocation.settlementId = event?.id;
    this.newLocation.settlement = event;
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
