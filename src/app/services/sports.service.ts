import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SportModel} from "../models/sport.model";

@Injectable()
export class SportsService {
  constructor(private http: HttpClient) {
  }

  public get(): Observable<SportModel[]> {
    return this.http.get<SportModel[]>('assets/sports.stub.json');
  }
}
