import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {TrainingFormatModel} from "../models/training.format.model";

@Injectable()
export class TrainingFormatsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/training_formats' + path;
  }

  public get(): Observable<TrainingFormatModel[]> {
    return this.http.get<TrainingFormatModel[]>(this.getUrl(''));
  }

  public create(data: TrainingFormatModel): Observable<TrainingFormatModel> {
    return this.http.post<TrainingFormatModel>(this.getUrl(''), data);
  }

  public remove(id: number): Observable<TrainingFormatModel> {
    return this.http.delete<TrainingFormatModel>(this.getUrl('/' + id));
  }
}
