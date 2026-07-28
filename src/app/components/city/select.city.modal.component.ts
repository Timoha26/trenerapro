import {Component, EventEmitter, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {RatingModule} from "ngx-bootstrap/rating";
import {BsModalRef} from "ngx-bootstrap/modal";
import {GeoService} from "../../services/geo.service";
import {CityModel} from "../../models/cities/city.model";
import {TypeaheadModule} from "ngx-bootstrap/typeahead";

@Component({
  selector: 'city-modal',
  templateUrl: './select.city.modal.component.html',
  styleUrls: ['./select.city.modal.component.scss'],
  imports: [
    FormsModule,
    NgClass,
    RatingModule,
    TypeaheadModule
  ],
  standalone: true
})
export class SelectCityModalComponent implements OnInit {
  constructor(private modalRef: BsModalRef,
              private geoService: GeoService) {
  }

  cities: CityModel[] = [];
  selectedCity?: string;
  chosenCity?: CityModel;
  event: EventEmitter<CityModel> = new EventEmitter<CityModel>();

  ngOnInit() {
    this.cities = this.geoService.cities();
  }

  onSelect(event: any) {
    this.chosenCity = event.item;
  }

  save() {
    this.event.emit(this.chosenCity);
    this.modalRef.hide();
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
