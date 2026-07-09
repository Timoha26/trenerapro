import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {SettlementModel} from "../models/settlement.model";

@Injectable()
export class SettlementsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/settlements' + path;
  }

  public get(): Observable<SettlementModel[]> {
    return this.http.get<SettlementModel[]>(this.getUrl(''));
  }

  public create(data: SettlementModel): Observable<SettlementModel> {
    return this.http.post<SettlementModel>(this.getUrl(''), data);
  }

  public remove(id: number): Observable<SettlementModel> {
    return this.http.delete<SettlementModel>(this.getUrl('/' + id));
  }
}
