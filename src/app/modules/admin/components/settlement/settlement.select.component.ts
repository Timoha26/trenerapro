import {Component, EventEmitter, Input, Output} from "@angular/core";
import {SettlementsService} from "../../../../services/settlements.service";
import {SettlementModel} from "../../../../models/settlement.model";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SettlementCreateModalComponent} from "./settlement.create.modal.component";
import {TypeaheadModule} from "ngx-bootstrap/typeahead";

@Component({
  selector: 'settlement-select',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    TypeaheadModule
  ],
  templateUrl: 'settlement.select.component.html'
})
export class SettlementSelectComponent {
  @Input() settlementId?: number;
  @Output() settlementChanged = new EventEmitter<SettlementModel>();

  settlements: SettlementModel[] = [];
  selectedSettlement?: string;
  chosenSettlement?: SettlementModel;

  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService, private settlementsService: SettlementsService) {
  }

  addSettlement() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md'
    };

    this.modalRef = this.modalService.show(SettlementCreateModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (settlement: SettlementModel) => {
        if (settlement)
          this.settlements.push(settlement);
      }
    });
  }

  private getSettlements() {
    this.settlementsService.get().subscribe({next: (data: SettlementModel[]) => this.settlements = data});
  }

  onSelect(event: any) {
    this.chosenSettlement = event.item;
    this.settlementChanged.emit(event.item);
  }

  ngOnInit() {
    this.getSettlements();
  }
}
