import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {ClubModel} from "../models/clubs/club.model";
import {conf} from "../conf/conf";
import {ClubFiltersModel} from "../models/clubs/club.filters.model";

@Injectable()
export class ClubsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/clubs' + path;
  }

  public get(filters?: ClubFiltersModel): Observable<PageResultModel<ClubModel>> {
    const params: HttpParams = new HttpParams()
      .set('offset', filters?.offset ?? 0)
      .set('limit', filters?.limit ?? 6);

    return this.http.get<PageResultModel<ClubModel>>(this.getUrl(''), {
      params: params
    });
  }

  public getDetails(clubId: number): Observable<ClubModel> {
    return this.http.get<ClubModel>(this.getUrl('/' + clubId));
  }
}
