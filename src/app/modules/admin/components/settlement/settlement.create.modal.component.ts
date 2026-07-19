import {Component, EventEmitter} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {SettlementModel} from "../../../../models/settlement.model";
import {SettlementsService} from "../../../../services/settlements.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'sport-create-modal',
  templateUrl: 'settlement.create.modal.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class SettlementCreateModalComponent {
  event: EventEmitter<SettlementModel> = new EventEmitter<SettlementModel>();

  newSettlement: SettlementModel = {
    country: undefined,
    region: undefined,
    settlement: undefined
  };

  constructor(private modalRef: BsModalRef, private toastr: ToastrService, private settlementsService: SettlementsService) {
  }

  save() {
    this.settlementsService.create(this.newSettlement).subscribe({
      next: (data: SettlementModel) => {
        this.event.emit(data);
        this.toastr.success('локация создана', 'Локация');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Локация');
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
