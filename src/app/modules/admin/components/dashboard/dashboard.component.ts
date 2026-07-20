import {Component} from "@angular/core";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'admin-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  isLogged: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(){
    this.isLogged = this.authService.isLogged();

    if(!this.isLogged)
      this.router.navigate(['/']);
  }
}
