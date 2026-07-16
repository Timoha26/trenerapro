import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {TrainerModel} from "../models/trainers/trainer.model";
import {TrainerFiltersModel} from "../models/trainers/trainer.filters.model";
import {conf} from "../conf/conf";
import {TrainerDataFilters} from "../models/trainers/trainer.data.filters";
import {TrainerCreateRequestModel} from "../models/trainers/trainer.create.request.model";

@Injectable()
export class TrainersService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/trainers' + path;
  }

  public get(pageFilters?: TrainerFiltersModel, dataFilters?: TrainerDataFilters): Observable<PageResultModel<TrainerModel>> {
    const params: HttpParams = new HttpParams()
      .set('offset', pageFilters?.offset ?? 0)
      .set('limit', pageFilters?.limit ?? 6)
      .set('sort_by', pageFilters?.sort ?? 'name')
      .set('is_desc', pageFilters?.desc ?? false);

    return this.http.post(this.getUrl('/filters'), dataFilters, {
      params: params
    });
  }

  public getTop(limit?: number, sportId?: number): Observable<PageResultModel<TrainerModel>> {
    let params: HttpParams = new HttpParams()
      .set('limit', limit ?? 4);

    if(sportId)
      params = params.set('sportId', sportId);

    return this.http.get<PageResultModel<TrainerModel>>(this.getUrl('/random'), {
      params: params
    });
  }

  public getDetails(id: number): Observable<TrainerModel> {
    return this.http.get<TrainerModel>(this.getUrl('/' + id));
  }

  public create(data: TrainerCreateRequestModel): Observable<TrainerModel> {
    return this.http.post<TrainerModel>(this.getUrl(''), data);
  }

  public remove(id: number): Observable<TrainerModel> {
    return this.http.delete<TrainerModel>(this.getUrl('/' + id));
  }
}
