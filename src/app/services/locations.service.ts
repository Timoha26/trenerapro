import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {LocationCreateModel} from "../models/locations/location.create.model";
import {Observable} from "rxjs";
import {LocationModel} from "../models/locations/location.model";

@Injectable({providedIn: 'root'})
export class LocationsService {
  constructor(private http: HttpClient) {
  }

  private getUrl(path: string): string {
    return conf.trainerProUrl + '/api/v1/locations' + path;
  }

  public create(location: LocationCreateModel): Observable<LocationModel> {
    return this.http.post<LocationModel>(this.getUrl(''), location);
  }

  public update(locationId: number, location: LocationCreateModel): Observable<LocationModel> {
    return this.http.put<LocationModel>(this.getUrl('/' + locationId), location);
  }

  public remove(locationId: number): Observable<any> {
    return this.http.delete(this.getUrl('/' + locationId));
  }
}
