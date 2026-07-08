import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'admin-root',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  isCollapsed: boolean = false;

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
