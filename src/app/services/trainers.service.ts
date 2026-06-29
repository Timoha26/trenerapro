import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageResultModel} from "../models/page.result.model";
import {TrainerModel} from "../models/trainer.model";

@Injectable()
export class TrainersService {
  constructor(private http: HttpClient) {
  }

  public get(): Observable<PageResultModel<TrainerModel>> {
    return this.http.get('assets/trainers.stub.json');
  }

  public getDetails(trainerId: number): Observable<TrainerModel> {
    return new Observable<TrainerModel>(subscriber => {
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
