import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {ClubModel} from "../models/clubs/club.model";
import {conf} from "../conf/conf";
import {ClubFiltersModel} from "../models/clubs/club.filters.model";
import {ClubDataFiltersModel} from "../models/clubs/club.data.filters.model";
import {ClubCreateRequestModel} from "../models/clubs/club.create.request.model";
import {ClubCreateModel} from "../models/clubs/club.create.model";

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
      .set('limit', filters?.limit ?? 6)
      .set('sort_by', filters?.sort ?? 6)
      .set('asc', !filters?.desc ?? 6);

    let dataFilters: ClubDataFiltersModel = {
      settlementIds: filters?.settlementIds,
      sportIds: filters?.sportIds,
      verified: filters?.verified,
      minRating: filters?.minRating
    };

    return this.http.post<PageResultModel<ClubModel>>(this.getUrl('/filters'), dataFilters, {
      params: params
    });
  }

  public getTop(limit?: number, sportId?: number): Observable<ClubModel[]> {
    let params: HttpParams = new HttpParams()
      .set('limit', limit ?? 4);

    if (sportId)
      params = params.set('sportId', sportId);

    return this.http.get<ClubModel[]>(this.getUrl('/random'), {
      params: params
    });
  }

  public getDetails(clubId: number): Observable<ClubModel> {
    return this.http.get<ClubModel>(this.getUrl('/' + clubId));
  }

  public create(club?: ClubCreateRequestModel): Observable<any> {
    return this.http.post<any>(this.getUrl(''), club);
  }

  public update(clubId?: number, club?: ClubCreateModel): Observable<ClubModel> {
    return this.http.put(this.getUrl('/' + clubId), club);
  }

  public remove(clubId: number): Observable<any> {
    return this.http.delete<any>(this.getUrl('/' + clubId));
  }

  public approve(clubId: number): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('clubId', clubId);

    return this.http.put(this.getUrl('/approve'), null, {
      params: params
    });
  }

  public unapprove(clubId: number): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('clubId', clubId);

    return this.http.put(this.getUrl('/unapprove'), null, {
      params: params
    });
  }

  public getClubCreateRequestModel(): ClubCreateRequestModel {
    return {
      createClub: {
        name: undefined,
        address: undefined,
        description: undefined,
        settlementId: undefined,
      },
      sportIds: [],
      contactIds: [],
      uploadedFileIds: []
    };
  }

  // relations with sports
  public updateRelationsSports(clubId: number, sportIds: number[]): Observable<any> {
    return new Observable<any>(subscriber => {
      this.getRelationsSports(clubId).subscribe({
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
            requests.push(this.addRelationsSports(clubId, addIds));

          if (deleteIds.length > 0)
            requests.push(this.deleteRelationsSports(clubId, deleteIds));

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
    return conf.trainerProUrl + '/api/v1/clubs_sports';
  }

  private getRelationsSports(clubId: number): Observable<{ clubId: number, sportId: number }[]> {
    const params: HttpParams = new HttpParams()
      .set('clubId', clubId);

    return this.http.get<{ clubId: number, sportId: number }[]>(this.getRelationsSportsUrl(), {
      params: params
    });
  }

  private addRelationsSports(clubId: number, sportIds: number[]): Observable<any[]> {
    const requests = sportIds.map(sportId => this.http.post(this.getRelationsSportsUrl(), {
      clubId: clubId,
      sportId: sportId
    }));

    return forkJoin(requests);
  }

  private deleteRelationsSports(clubId: number, sportIds: number[]): Observable<any[]> {
    const requests = sportIds.map(sportId => {
      const params: HttpParams = new HttpParams()
        .set('clubId', clubId)
        .set('sportId', sportId);

      return this.http.delete(this.getRelationsSportsUrl(), {
        params: params
      });
    });

    return forkJoin(requests);
  }
}
