import {Component, EventEmitter} from "@angular/core";
import {FormsModule, NgForm} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {AuthService} from "../../services/auth/auth.service";
import {AuthModel} from "../../models/auth.model";
import {TokenModel} from "../../models/token.model";
import {NgIf} from "@angular/common";

@Component({
  selector: 'auth-modal',
  templateUrl: './auth.modal.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class AuthModalComponent {
  event: EventEmitter<boolean> = new EventEmitter<boolean>();

  authError?: string;

  authData: AuthModel = {
    username: undefined,
    password: undefined
  };

  constructor(private modalRef: BsModalRef,
              private authService: AuthService) {
  }

  login(form: NgForm) {
    this.authService.login(this.authData).subscribe({
      next: (data: TokenModel) => {
        form.resetForm();
        this.authError = undefined;
        this.event.emit(true);
        this.modalRef.hide();
      },
      error: (error) => {
        form.resetForm();
        this.authError = 'Неверный логин или пароль!';
        this.event.emit(false);
      }
    });
  }

  cancel() {
    this.event.emit(false);
    this.modalRef.hide();
  }
}
