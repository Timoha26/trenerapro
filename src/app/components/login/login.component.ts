import {Component} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {AuthModel} from "../../models/auth.model";
import {NgForm} from "@angular/forms";
import {TokenModel} from "../../models/token.model";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent {
  authError?: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  authData: AuthModel = {
    username: undefined,
    password: undefined
  };

  login(form: NgForm) {
    this.authService.login(this.authData).subscribe({
      next: (data: TokenModel) => {
        form.resetForm();
        this.authError = undefined;
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        form.resetForm();
        this.authError = 'Неверный логин или пароль!';
      }
    });
  }
}
