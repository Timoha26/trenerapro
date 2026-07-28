import {Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {conf} from "../conf/conf";
import {Observable} from "rxjs";
import {CityModel} from "../models/cities/city.model";
import {RegionModel} from "../models/cities/region.model";

@Injectable({providedIn: 'root'})
export class GeoService {
  constructor(private http: HttpClient) {
  }

  public cities = signal<CityModel[]>([]);

  public currentCity = signal<CityModel | undefined>(undefined);

  private moscowGuid: string = "0c5b2444-70a0-4932-980c-b4dc0d3f02b5";

  public getCities(): Observable<any> {
    return new Observable<any>(subscriber => {
      this.http.get<CityModel[]>(conf.filesUrl + '/trainerpro/static/russia-cities.json')
        .subscribe({
          next: data => {
            const cities: CityModel[] = data.map(city => ({
              ...city,
              regionName: city.region.fullname
            }));

            this.cities.set(cities);

            this.loadSavedCity(cities);

            subscriber.next(true);
            subscriber.complete();
          },
          error: () => subscriber.error()
        });
    });
  }

  public selectCity(city: CityModel): void {
    this.currentCity.set(city);
    localStorage.setItem("user_city", JSON.stringify(city));
  }

  private loadSavedCity(cities: CityModel[]) {
    const saved = localStorage.getItem("user_city");

    if (saved)
      this.currentCity.set(JSON.parse(saved))
    else
      this.detectCityByIP(cities);
  }

  private detectCityByIP(cities: CityModel[]): void {
    const moscow = cities.find(city => city.guid == this.moscowGuid);

    this.currentCity.set(moscow);
  }
}
