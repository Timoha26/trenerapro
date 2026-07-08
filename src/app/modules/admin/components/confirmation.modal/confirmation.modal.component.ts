import {Component, EventEmitter} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  templateUrl: 'confirmation.modal.component.html',
  selector: 'admin-confirmation-modal'
})
export class ConfirmationModalComponent {
  title?: string;
  text?: string;
  event: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef) {
  }

  confirm() {
    this.event.emit(true);
    this.modalRef.hide();
  }

  decline() {
    this.event.emit(false);
    this.modalRef.hide();
  }
}
