import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
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
    if (this.authService.isLogged()) return true;

    this.router.navigate(['/login']);

    return false;
  }
}
