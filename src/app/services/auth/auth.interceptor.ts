import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.authService.getToken();
    const tokenType: string | null = this.authService.getTokenType();

    let cloned: HttpRequest<any> | null = null;

    if (token)
      cloned = request.clone({
        headers: request.headers.set('Authorization', tokenType + ' ' + token)
      });

    return next.handle(cloned ? cloned : request);
  }
}
