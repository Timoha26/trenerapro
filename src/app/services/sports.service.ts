import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SportModel} from "../models/sport.model";
import {conf} from "../conf/conf";

@Injectable()
export class SportsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/sports' + path;
  }

  public get(): Observable<SportModel[]> {
    return this.http.get<SportModel[]>(this.getUrl(''));
  }

  public create(data: SportModel): Observable<SportModel> {
    return this.http.post<SportModel>(this.getUrl(''), data);
  }

  public remove(id: number): Observable<SportModel> {
    return this.http.delete<SportModel>(this.getUrl('/' + id));
  }
}
