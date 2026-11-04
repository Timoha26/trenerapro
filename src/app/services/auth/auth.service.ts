import {TokenModel} from "../../models/token.model";
import {map, Observable} from "rxjs";
import {AuthModel} from "../../models/auth.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {conf} from "../../conf/conf"
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {AuthModalComponent} from "../../components/auth/auth.modal.component";

@Injectable({providedIn: 'root'})
export class AuthService {
  private modalRef?: BsModalRef;

  constructor(private http: HttpClient,
              private router: Router,
              private modalService: BsModalService) {
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

    if (this.router.url.startsWith('/admin')) {
      this.loginModal();
      this.router.navigate(['/']);
    }
  }

  public loginModal() {
    const modalOptions: ModalOptions = {
      class: 'modal-dialog-centered modal-sm landing-modal'
    };

    this.modalRef = this.modalService.show(AuthModalComponent, modalOptions);

    this.modalRef.content.event.subscribe({
      next: (result: boolean) => {
        console.log(result ? 'logged' : 'not logged');
      }
    });
  }

  public isLogged(): boolean {
    const tokenData = this.getTokenData();

    if (!tokenData || !tokenData.exp || !tokenData.accessToken) return false;

    const expDate = new Date(tokenData.exp);
    const nowDate = new Date();

    const expTimeUtc = expDate.getTime();
    const nowTimeUtc = nowDate.getTime();

    if (nowTimeUtc > expTimeUtc) {
      this.logout();
      return false;
    }

    return true;
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
