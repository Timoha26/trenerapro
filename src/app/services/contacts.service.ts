import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {ContactModel} from "../models/contact.model";
import {Observable} from "rxjs";

@Injectable()
export class ContactsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/contacts' + path;
  }

  public create(contact: ContactModel): Observable<ContactModel> {
    return this.http.post<ContactModel>(this.getUrl(''), contact);
  }

  public update(contact: ContactModel): Observable<ContactModel> {
    return this.http.put<ContactModel>(this.getUrl('/' + contact.id), contact);
  }

  public remove(contactId: number): Observable<any> {
    return this.http.delete(this.getUrl('/' + contactId));
  }
}
