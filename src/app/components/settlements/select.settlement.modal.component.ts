import {Component, EventEmitter, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {RatingModule} from "ngx-bootstrap/rating";
import {BsModalRef} from "ngx-bootstrap/modal";
import {GeoService} from "../../services/geo.service";
import {TypeaheadModule} from "ngx-bootstrap/typeahead";
import {SettlementModel} from "../../models/settlement.model";

@Component({
  selector: 'settlement-modal',
  templateUrl: './select.settlement.modal.component.html',
  styleUrls: ['./select.settlement.modal.component.scss'],
  imports: [
    FormsModule,
    NgClass,
    RatingModule,
    TypeaheadModule
  ],
  standalone: true
})
export class SelectSettlementModalComponent implements OnInit {
  constructor(private modalRef: BsModalRef,
              private geoService: GeoService) {
  }

  settlements: SettlementModel[] = [];
  selectedSettlement?: string;
  chosenSettlement?: SettlementModel;
  event: EventEmitter<SettlementModel> = new EventEmitter<SettlementModel>();

  ngOnInit() {
    this.settlements = this.geoService.settlements();
  }

  onSelect(event: any) {
    this.chosenSettlement = event.item;
  }

  save() {
    this.event.emit(this.chosenSettlement);
    this.modalRef.hide();
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
