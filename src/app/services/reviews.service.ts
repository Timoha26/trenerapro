import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {ReviewFiltersModel} from "../models/reviews/review.filters.model";
import {ReviewModel} from "../models/reviews/review.model";
import {ReviewCreateModel} from "../models/reviews/review.create.model";

@Injectable()
export class ReviewsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/reviews' + path;
  }

  public get(filters?: ReviewFiltersModel): Observable<PageResultModel<ReviewModel>> {
    const params: HttpParams = new HttpParams()
      .set('offset', filters?.offset ?? 0)
      .set('limit', filters?.limit ?? 10);

    return this.http.get<PageResultModel<ReviewModel>>(this.getUrl(''), {
      params: params
    });
  }

  public create(data: ReviewCreateModel): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(this.getUrl(''), data);
  }
}
