import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {TrainerModel} from "../models/trainers/trainer.model";
import {TrainerFiltersModel} from "../models/trainers/trainer.filters.model";

@Injectable()
export class TrainersService {
  constructor(private http: HttpClient) {
  }

  public get(filters: TrainerFiltersModel): Observable<PageResultModel<TrainerModel>> {
    const params: HttpParams = new HttpParams()
      .set('offset', filters?.offset ?? 0)
      .set('limit', filters?.limit ?? 10)
      .set('sort_by', filters?.sort ?? 'name')
      .set('is_desc', filters?.desc ?? false);

    return this.http.get('assets/trainers.stub.json', {
      params: params
    });
  }

  public getTop(): Observable<PageResultModel<TrainerModel>> {
    return this.http.get('assets/trainers.stub.json');
  }

  public getDetails(trainerId: number): Observable<TrainerModel> {
    const filters: TrainerFiltersModel = {offset: 0, limit: 4, sort: 'name', desc: false};

    return new Observable<TrainerModel>(subscriber => {
      this.get(filters).subscribe({
        next: (data) => {
          if (data.items == null) {
            subscriber.error();
            return;
          }

          for (let i = 0; i < data.items.length; i++)
            if (data.items[i].id == trainerId) {
              subscriber.next(data.items[i]);
              subscriber.complete();
              return;
            }
        },
        error: (error) => {
          subscriber.error(error);
        }
      });
    });
  }
}
