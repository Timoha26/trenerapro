import {Component} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {AuthModel} from "./models/auth.model";
import {NgForm} from "@angular/forms";
import {TokenModel} from "./models/token.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'trenerapro-app';
  showLoginForm: boolean = false;
  authError?: string;
  authData: AuthModel = {
    username: undefined,
    password: undefined
  };

  constructor(private authService: AuthService) {
  }

  isLogged() {
    return this.authService.isLogged();
  }

  login(form: NgForm) {
    this.authService.login(this.authData).subscribe({
      next: (data: TokenModel) => {
        form.resetForm();
        this.showLoginForm = false;
        this.authError = undefined;
      },
      error: (error) => {
        form.resetForm();
        this.authError = 'Неверный логин или пароль!';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
