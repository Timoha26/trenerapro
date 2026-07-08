import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {catchError, Observable, throwError} from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(data => {
      if ([401, 403].includes(data.status) && this.authService.isLogged())
        this.authService.logout();

      const error = data.error?.message || data.statusText || data.status;
      console.error(error);
      return throwError(() => error);
    }));
  }
}
