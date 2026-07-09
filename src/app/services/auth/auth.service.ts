import {TokenModel} from "../../models/token.model";
import {map, Observable} from "rxjs";
import {AuthModel} from "../../models/auth.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {conf} from "../../conf/conf"

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/auth' + path;
  }

  public login(authData: AuthModel): Observable<TokenModel> {
    return this.http.post(this.getUrl('/login'), authData).pipe(map((data: TokenModel) => {
      this.setSession(data);
      return data;
    }));
  }

  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  public isLogged(): boolean {
    return this.getTokenData() != null;
  }

  public getToken(): string | null {
    return this.getTokenData()?.accessToken ?? null;
  }

  public getTokenType(): string | null {
    return this.getTokenData()?.tokenType ?? null;
  }

  private setSession(token: TokenModel) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  private getTokenData(): TokenModel | null {
    const token = localStorage.getItem('token');

    if (!token) return null;

    return JSON.parse(token);
  }
}
