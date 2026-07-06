import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {ClubModel} from "../models/clubs/club.model";

@Injectable()
export class ClubsService {
  constructor(private http: HttpClient) {
  }

  public get(): Observable<PageResultModel<ClubModel>> {
    return this.http.get('assets/clubs.stub.json');
  }

  public getDetails(trainerId: number): Observable<ClubModel> {
    return new Observable<ClubModel>(subscriber => {
      this.get().subscribe({
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
      })
    })
  }
}
