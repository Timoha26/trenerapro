import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {TrainerModel} from "../models/trainers/trainer.model";
import {TrainerFiltersModel} from "../models/trainers/trainer.filters.model";
import {conf} from "../conf/conf";
import {TrainerDataFilters} from "../models/trainers/trainer.data.filters";
import {TrainerCreateRequestModel} from "../models/trainers/trainer.create.request.model";
import {ClubCreateModel} from "../models/clubs/club.create.model";
import {ClubModel} from "../models/clubs/club.model";
import {TrainerCreateModel} from "../models/trainers/trainer.create.model";

@Injectable()
export class TrainersService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/trainers' + path;
  }

  public get(filters?: TrainerFiltersModel): Observable<PageResultModel<TrainerModel>> {
    const params: HttpParams = new HttpParams()
      .set('offset', filters?.offset ?? 0)
      .set('limit', filters?.limit ?? 6)
      .set('sort_by', filters?.sort ?? 'name')
      .set('asc', !filters?.desc ?? false);


    let dataFilters: TrainerDataFilters = {
      settlementIds: filters?.settlementIds,
      sportIds: filters?.sportIds,
      clientCategoryIds: filters?.clientCategoryIds,
      trainingFormatIds: filters?.trainingFormatIds,
      verified: filters?.verified,
      minRating: filters?.minRating,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice
    };

    return this.http.post(this.getUrl('/filters'), dataFilters, {
      params: params
    });
  }

  public getTop(limit?: number, sportId?: number): Observable<TrainerModel[]> {
    let params: HttpParams = new HttpParams()
      .set('limit', limit ?? 4);

    if (sportId)
      params = params.set('sportId', sportId);

    return this.http.get<TrainerModel[]>(this.getUrl('/random'), {
      params: params
    });
  }

  public getDetails(trainerId: number): Observable<TrainerModel> {
    return this.http.get<TrainerModel>(this.getUrl('/' + trainerId));
  }

  public create(data: TrainerCreateRequestModel): Observable<TrainerModel> {
    return this.http.post<TrainerModel>(this.getUrl(''), data);
  }

  public update(trainerId?: number, trainer?: TrainerCreateModel): Observable<TrainerModel> {
    return this.http.put(this.getUrl('/' + trainerId), trainer);
  }

  public remove(trainerId: number): Observable<TrainerModel> {
    return this.http.delete<TrainerModel>(this.getUrl('/' + trainerId));
  }

  public getTrainerCreateRequestModel(): TrainerCreateRequestModel {
    return {
      createTrainer: {
        firstname: undefined,
        lastname: undefined,
        patronymic: undefined,
        age: undefined,
        experience: undefined,
        gender: undefined,
        price: undefined,
        priceGradation: undefined,
        description: undefined,
        settlementId: undefined
      },
      sportIds: [],
      trainingFormatIds: [],
      clientCategoryIds: [],
      uploadedFileIds: []
    };
  }

  // update trainingFormats
  public updateTrainingFormats(trainerId: number, trainingFormatIds: number[]): Observable<any> {
    return this.http.put(this.getUrl('/' + trainerId + '/trainingFormats'), trainingFormatIds);
  }

  // update clientCategories
  public updateClientCategories(trainerId: number, clientCategoryIds: number[]): Observable<any> {
    return this.http.put(this.getUrl('/' + trainerId + '/clientCategories'), clientCategoryIds);
  }

  // relations with sports
  public updateRelationsSports(trainerId: number, sportIds: number[]): Observable<any> {
    return new Observable<any>(subscriber => {
      this.getRelationsSports(trainerId).subscribe({
        next: (data) => {
          const sportIdsFromServer = data.map(item => item.sportId);

          let deleteIds: number[] = [];
          let addIds: number[] = [];

          // если в старом списке нет ид из нового списка то добавлять
          sportIds.forEach(id => {
            if (sportIdsFromServer.indexOf(id) == -1)
              addIds.push(id);
          });

          // если в новом списке нет ид из старого списка то удалять
          sportIdsFromServer.forEach(id => {
            if (sportIds.indexOf(id) == -1)
              deleteIds.push(id);
          });

          let requests: any[] = [];

          if (addIds.length > 0)
            requests.push(this.addRelationsSports(trainerId, addIds));

          if (deleteIds.length > 0)
            requests.push(this.deleteRelationsSports(trainerId, deleteIds));

          forkJoin(requests).subscribe({
            next: (results) => {
              subscriber.next(results);
              subscriber.complete();
            },
            error: (error) => subscriber.error(error)
          });
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  private getRelationsSportsUrl(): string {
    return conf.trainerProUrl + '/api/v1/trainers_sports';
  }

  private getRelationsSports(trainerId: number): Observable<{ trainerId: number, sportId: number }[]> {
    const params: HttpParams = new HttpParams()
      .set('trainerId', trainerId);

    return this.http.get<{ trainerId: number, sportId: number }[]>(this.getRelationsSportsUrl(), {
      params: params
    });
  }

  private addRelationsSports(trainerId: number, sportIds: number[]): Observable<any[]> {
    const requests = sportIds.map(sportId => this.http.post(this.getRelationsSportsUrl(), {
      trainerId: trainerId,
      sportId: sportId
    }));

    return forkJoin(requests);
  }

  private deleteRelationsSports(trainerId: number, sportIds: number[]): Observable<any[]> {
    const requests = sportIds.map(sportId => {
      const params: HttpParams = new HttpParams()
        .set('trainerId', trainerId)
        .set('sportId', sportId);

      return this.http.delete(this.getRelationsSportsUrl(), {
        params: params
      });
    });

    return forkJoin(requests);
  }
}
