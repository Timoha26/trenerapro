import {Component, EventEmitter, OnInit} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {ContactModel} from "../../../../models/contact.model";
import {ContactsService} from "../../../../services/contacts.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'contacts-modal',
  templateUrl: 'contacts.modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class ContactsModalComponent implements OnInit {
  constructor(private modalRef: BsModalRef, private toastr: ToastrService, private contactsService: ContactsService) {
  }

  clubId?: number = undefined;
  trainerId?: number = undefined;
  event: EventEmitter<ContactModel> = new EventEmitter<ContactModel>();

  newContact: ContactModel = {
    id: undefined,
    fullname: undefined,
    email: undefined,
    phone: undefined,
    trainerId: undefined,
    clubId: undefined
  };

  ngOnInit() {
    this.newContact.clubId = this.clubId;
    this.newContact.trainerId = this.trainerId;
  }

  save() {
    this.contactsService.create(this.newContact).subscribe({
      next: (data: ContactModel) => {
        this.event.emit(data);
        this.toastr.success('контакт создан', 'Контакты');
        this.modalRef.hide();
      },
      error: (error) => {
        this.toastr.error('Произошла ошибка', 'Контакты');
      }
    });
  }

  cancel() {
    this.event.emit(undefined);
    this.modalRef.hide();
  }
}
