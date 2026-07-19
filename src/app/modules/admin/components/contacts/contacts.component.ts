import {Component, Input} from "@angular/core";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {ContactsService} from "../../../../services/contacts.service";
import {ContactModel} from "../../../../models/contact.model";
import {ContactsModalComponent} from "./contacts.modal.component";
import {NgForOf, NgIf} from "@angular/common";
import {CommonService} from "../../../../services/common.service";

@Component({
  selector: 'contacts',
  templateUrl: 'contacts.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class ContactsComponent {
  constructor(private modalRef: BsModalRef,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private contactsService: ContactsService,
              private commonService: CommonService) {
  }

  @Input() clubId?: number = undefined;
  @Input() trainerId?: number = undefined;
  @Input() contactIds: number[] = [];
  @Input() contacts: ContactModel[] = [];

  addContact() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-md',
      initialState: {
        trainerId: this.trainerId,
        clubId: this.clubId
      }
    };

    this.modalRef = this.modalService.show(ContactsModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (contact: ContactModel) => {
        if (contact?.id) {
          this.contactIds.push(contact.id);
          this.contacts.push(contact);
        }
      }
    });
  }

  removeContact(contactId?: number) {
    if (!contactId) return;

    this.contactsService.remove(contactId).subscribe({
      next: data => {
        const idIndex = this.contactIds.indexOf(contactId);
        if (idIndex > -1)
          this.contactIds.splice(idIndex, 1);

        const contactIndex = this.commonService.getIndexInArrayById(contactId, this.contacts);
        if (contactIndex > -1)
          this.contacts.splice(contactIndex, 1);

        this.toastr.success('контакт удален', 'Контакты');
      }
    });
  }
}
