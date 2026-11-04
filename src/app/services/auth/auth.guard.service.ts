import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {
  }

  public canMatch() {
    return this.checkAuth();
  }

  public canLoad() {
    return this.checkAuth();
  }

  public canActivate() {
    return this.checkAuth();
  }

  public canActivateChild() {
    return this.checkAuth();
  }

  private checkAuth() {
    return this.authService.isLogged();
  }
}
