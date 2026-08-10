import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {SearchItemModel} from "../models/search/search.item.model";
import {EntityTypeEnum} from "../models/search/entity.type.enum";

@Injectable({providedIn: 'root'})
export class SearchService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/search' + path;
  }

  public get(searchText: string, settlementId?: number, entityType?: EntityTypeEnum): Observable<SearchItemModel[]> {
    let params: HttpParams = new HttpParams()
      .set('searchQuery', searchText);

    if (settlementId)
      params = params.set('settlementId', settlementId);

    if(entityType)
      params = params.set('entityType', entityType);

    return this.http.get<SearchItemModel[]>(this.getUrl(''), {
      params: params
    });
  }
}
