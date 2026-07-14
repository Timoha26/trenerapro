import {Component} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {AuthModel} from "./models/auth.model";
import {NgForm} from "@angular/forms";
import {TokenModel} from "./models/token.model";
import {RestoreUrlService} from "./services/restore.url.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'trenerapro-app';
  logoUrl?: string;
  showLoginForm: boolean = false;
  authError?: string;
  authData: AuthModel = {
    username: undefined,
    password: undefined
  };

  constructor(private authService: AuthService, private restoreUrlService: RestoreUrlService) {
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

  ngOnInit(){
    this.logoUrl = this.restoreUrlService.restoreUrl('/trainerpro/static/logo2.svg');
  }
}
